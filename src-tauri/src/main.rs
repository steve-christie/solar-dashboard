// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod dash;
mod giv_energy_client;

use anyhow::Result;
use giv_energy_client::GivEnergyClient;
use tauri::Manager;

#[tauri::command]
async fn get_account_data() -> Result<serde_json::Value, String> {
    log::info!("Received request: get_account_data");

    let api_key = std::env::var("GIV_ENERGY_API_KEY").map_err(|e| {
        log::error!("Failed to get API key from environment: {}", e);
        "GIV_ENERGY_API_KEY environment variable not set. Please check your .env file.".to_string()
    })?;

    let client = GivEnergyClient::new(api_key);
    let account = client.get_account().await.map_err(|e| {
        log::error!("Failed to fetch account data: {}", e);
        e.to_string()
    })?;

    log::info!("Successfully fetched account data");
    let account_json = serde_json::to_value(&account).map_err(|e| {
        log::error!("Failed to serialize account to JSON: {}", e);
        e.to_string()
    })?;
    Ok(account_json)
}

#[tauri::command]
async fn get_inverter_data(serial: String) -> Result<serde_json::Value, String> {
    log::info!("Received request: get_inverter_data (serial: {})", serial);

    let api_key = std::env::var("GIV_ENERGY_API_KEY").map_err(|e| {
        log::error!("Failed to get API key from environment: {}", e);
        "GIV_ENERGY_API_KEY environment variable not set. Please check your .env file.".to_string()
    })?;

    let client = GivEnergyClient::new(api_key);

    // Fetch both request data and meter data in parallel
    log::info!("Fetching inverter data for serial: {}", serial);
    let (request_data, meter_data) = tokio::join!(
        client.get_inverter_request_data(&serial),
        client.get_inverter_meter_data(&serial)
    );

    let request_data = request_data.map_err(|e| {
        log::error!(
            "Failed to fetch inverter request data for serial {}: {}",
            serial,
            e
        );
        e.to_string()
    })?;

    let meter_data = meter_data.map_err(|e| {
        log::error!(
            "Failed to fetch inverter meter data for serial {}: {}",
            serial,
            e
        );
        e.to_string()
    })?;

    // Combine both responses into a single JSON object
    let combined = serde_json::json!({
        "request_data": request_data.data,
        "meter_data": meter_data.data
    });

    log::info!("Successfully fetched inverter data for serial: {}", serial);
    Ok(combined)
}

#[tauri::command]
async fn get_account_devices(
    account_id: String,
    page: Option<u32>,
) -> Result<serde_json::Value, String> {
    let page_num = page.unwrap_or(1);
    log::info!(
        "Received request: get_account_devices (account_id: {}, page: {})",
        account_id,
        page_num
    );

    let api_key = std::env::var("GIV_ENERGY_API_KEY").map_err(|e| {
        log::error!("Failed to get API key from environment: {}", e);
        "GIV_ENERGY_API_KEY environment variable not set. Please check your .env file.".to_string()
    })?;

    let client = GivEnergyClient::new(api_key);
    let devices = client
        .get_account_devices(&account_id, page_num)
        .await
        .map_err(|e| {
            log::error!(
                "Failed to fetch account devices for account_id {}: {}",
                account_id,
                e
            );
            e.to_string()
        })?;

    log::info!(
        "Successfully fetched account devices for account_id: {}",
        account_id
    );
    Ok(devices.data)
}

#[tauri::command]
async fn get_full_dashboard_data(
    full_refresh: bool,
    cached_inverter_serial: Option<String>,
) -> Result<serde_json::Value, String> {
    log::info!(
        "Received request: get_full_dashboard_data (full_refresh: {}, cached_inverter_serial: {:?})",
        full_refresh,
        cached_inverter_serial
    );

    let api_key = std::env::var("GIV_ENERGY_API_KEY").map_err(|e| {
        log::error!("Failed to get API key from environment: {}", e);
        "GIV_ENERGY_API_KEY environment variable not set. Please check your .env file.".to_string()
    })?;

    let client = GivEnergyClient::new(api_key);

    let (account_data, devices_data, inverter_serial) = if full_refresh {
        log::info!("Performing full refresh: fetching account, devices, and inverter data");

        // Step 1: Get account data
        let account = client.get_account().await.map_err(|e| {
            log::error!("Failed to fetch account data: {}", e);
            e.to_string()
        })?;

        let account_name = account.name.clone();
        log::info!(
            "Successfully fetched account data, account name: {}",
            account_name
        );

        // Convert account to JSON for return value
        let account_value = serde_json::to_value(&account).map_err(|e| {
            log::error!("Failed to serialize account to JSON: {}", e);
            e.to_string()
        })?;

        // Step 2: Get devices using account name
        let devices = client
            .get_account_devices(&account_name, 1)
            .await
            .map_err(|e| {
                log::error!("Failed to fetch account devices: {}", e);
                e.to_string()
            })?;

        let devices_value = devices.data.clone();
        let devices_array = devices_value.as_array().ok_or_else(|| {
            log::error!("Devices data is not an array");
            "Devices data is not an array".to_string()
        })?;

        if devices_array.is_empty() {
            return Err("No devices found in account".to_string());
        }

        // Step 3: Get first device and extract inverter serial
        let first_device = &devices_array[0];
        let inverter_serial = first_device
            .get("inverter")
            .and_then(|inv| inv.get("serial"))
            .and_then(|s| s.as_str())
            .ok_or_else(|| {
                log::error!("First device missing inverter serial");
                "First device missing inverter serial".to_string()
            })?;

        let inverter_serial_string = inverter_serial.to_string();
        log::info!(
            "Successfully fetched devices, using inverter serial: {}",
            inverter_serial_string
        );

        (account_value, devices_value, inverter_serial_string)
    } else {
        // Partial refresh: only fetch inverter data, use cached serial
        let inverter_serial = cached_inverter_serial.ok_or_else(|| {
            log::error!("Partial refresh requested but no cached inverter serial provided");
            "Partial refresh requires cached inverter serial".to_string()
        })?;

        log::info!(
            "Performing partial refresh: only fetching inverter data for serial: {}",
            inverter_serial
        );

        // Return empty objects for account and devices (they won't be updated)
        (
            serde_json::json!({}),
            serde_json::json!([]),
            inverter_serial,
        )
    };

    // Step 4: Get inverter data (always fetched)
    log::info!("Fetching inverter data for serial: {}", inverter_serial);
    let (request_data, meter_data) = tokio::join!(
        client.get_inverter_request_data(&inverter_serial),
        client.get_inverter_meter_data(&inverter_serial)
    );

    let request_data = request_data.map_err(|e| {
        log::error!(
            "Failed to fetch inverter request data for serial {}: {}",
            inverter_serial,
            e
        );
        e.to_string()
    })?;

    let meter_data = meter_data.map_err(|e| {
        log::error!(
            "Failed to fetch inverter meter data for serial {}: {}",
            inverter_serial,
            e
        );
        e.to_string()
    })?;

    // Combine all responses
    let combined = serde_json::json!({
        "account": account_data,
        "devices": devices_data,
        "inverter": {
            "serial": inverter_serial,
            "request_data": request_data.data,
            "meter_data": meter_data.data,
        },
        "full_refresh": full_refresh,
    });

    log::info!("Successfully fetched full dashboard data");
    Ok(combined)
}

/// Returns the path to `.env` in the platform-specific config directory, if available.
/// Linux: `$HOME/.config/solar-dashboard/.env`
/// macOS: `$HOME/Library/Application Support/solar-dashboard/.env`
/// Windows: `%APPDATA%/solar-dashboard/.env`
fn config_dir_env_path() -> Option<std::path::PathBuf> {
    #[cfg(target_os = "macos")]
    return std::env::var("HOME").ok().map(|h| {
        std::path::PathBuf::from(h)
            .join("Library")
            .join("Application Support")
            .join("solar-dashboard")
            .join(".env")
    });

    #[cfg(all(unix, not(target_os = "macos")))]
    return std::env::var("HOME")
        .ok()
        .map(|h| std::path::PathBuf::from(h).join(".config").join("solar-dashboard").join(".env"));

    #[cfg(windows)]
    return std::env::var("APPDATA")
        .ok()
        .map(|p| std::path::PathBuf::from(p).join("solar-dashboard").join(".env"));

    #[cfg(not(any(target_os = "linux", target_os = "macos", target_os = "windows")))]
    None
}

fn main() {
    // Initialize logger
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    log::info!("Starting GivEnergy Dashboard application");

    // Load environment variables from .env file.
    // Try (1) executable directory, (2) platform config dir, (3) current working directory (dev).
    let mut loaded = false;
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let env_path = exe_dir.join(".env");
            if env_path.exists() {
                if let Err(e) = dotenvy::from_path(&env_path) {
                    log::warn!("Could not load .env from executable directory: {}", e);
                } else {
                    log::info!("Loaded .env from executable directory");
                    loaded = true;
                }
            }
        }
    }
    if !loaded {
        if let Some(config_env) = config_dir_env_path() {
            if config_env.exists() {
                if let Err(e) = dotenvy::from_path(&config_env) {
                    log::warn!("Could not load .env from config directory: {}", e);
                } else {
                    log::info!("Loaded .env from config directory");
                    loaded = true;
                }
            }
        }
    }
    if !loaded {
        if let Err(e) = dotenvy::dotenv() {
            log::warn!("Could not load .env from current directory: {}", e);
            log::warn!("Continuing without .env file...");
        } else {
            log::info!("Loaded .env from current directory");
        }
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            get_account_data,
            get_inverter_data,
            get_account_devices,
            get_full_dashboard_data,
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
