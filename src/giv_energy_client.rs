use reqwest::Client;
use serde::{Deserialize, Serialize};
use anyhow::Result;

const API_BASE_URL: &str = "https://api.givenergy.cloud/v1";

/// Account data structure from GivEnergy API
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: u64,
    pub name: String,
    pub first_name: String,
    pub surname: String,
    pub role: String,
    pub email: String,
    pub address: String,
    pub postcode: String,
    pub country: String,
    pub telephone_number: String,
    pub timezone: String,
    pub standard_timezone: String,
    pub company: Option<String>,
    pub flags: Vec<String>,
}

/// Response structure for account data from GivEnergy API
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountResponse {
    pub data: serde_json::Value,
}

/// GivEnergy API client
pub struct GivEnergyClient {
    client: Client,
    api_key: String,
}

impl GivEnergyClient {
    /// Create a new GivEnergy client instance
    pub fn new(api_key: String) -> Self {
        Self {
            client: Client::new(),
            api_key,
        }
    }

    /// Fetch account information from the GivEnergy API
    pub async fn get_account(&self) -> Result<Account> {
        let url = format!("{}/account", API_BASE_URL);
        log::info!("Making API request: GET {}", url);
        
        let response = self
            .client
            .get(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .send()
            .await
            .map_err(|e| {
                log::error!("Network error while fetching account data: {}", e);
                e
            })?;

        let status = response.status();
        if !status.is_success() {
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            log::error!("API request failed: GET {} - Status: {} - Error: {}", url, status, error_text);
            anyhow::bail!("API request failed with status {}: {}", status, error_text);
        }

        log::info!("API request successful: GET {} - Status: {}", url, status);
        let account_response: AccountResponse = response.json().await.map_err(|e| {
            log::error!("Failed to parse account response JSON: {}", e);
            e
        })?;
        
        // Deserialize the nested data field
        let account: Account = serde_json::from_value(account_response.data).map_err(|e| {
            log::error!("Failed to deserialize account data: {}", e);
            e
        })?;
        
        Ok(account)
    }

    /// Fetch inverter request data from the GivEnergy API
    pub async fn get_inverter_request_data(&self, serial: &str) -> Result<AccountResponse> {
        let url = format!("{}/inverter/{}/system-data/latest", API_BASE_URL, serial);
        log::info!("Making API request: GET {} (serial: {})", url, serial);
        
        let response = self
            .client
            .get(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .send()
            .await
            .map_err(|e| {
                log::error!("Network error while fetching inverter request data for serial {}: {}", serial, e);
                e
            })?;

        let status = response.status();
        if !status.is_success() {
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            log::error!("API request failed: GET {} - Status: {} - Error: {}", url, status, error_text);
            anyhow::bail!("API request failed with status {}: {}", status, error_text);
        }

        log::info!("API request successful: GET {} - Status: {}", url, status);
        let inverter_data: AccountResponse = response.json().await.map_err(|e| {
            log::error!("Failed to parse inverter request data JSON for serial {}: {}", serial, e);
            e
        })?;
        Ok(inverter_data)
    }

    /// Fetch inverter meter data from the GivEnergy API
    pub async fn get_inverter_meter_data(&self, serial: &str) -> Result<AccountResponse> {
        let url = format!("{}/inverter/{}/meter-data/latest", API_BASE_URL, serial);
        log::info!("Making API request: GET {} (serial: {})", url, serial);
        
        let response = self
            .client
            .get(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .send()
            .await
            .map_err(|e| {
                log::error!("Network error while fetching inverter meter data for serial {}: {}", serial, e);
                e
            })?;

        let status = response.status();
        if !status.is_success() {
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            log::error!("API request failed: GET {} - Status: {} - Error: {}", url, status, error_text);
            anyhow::bail!("API request failed with status {}: {}", status, error_text);
        }

        log::info!("API request successful: GET {} - Status: {}", url, status);
        let meter_data: AccountResponse = response.json().await.map_err(|e| {
            log::error!("Failed to parse inverter meter data JSON for serial {}: {}", serial, e);
            e
        })?;
        Ok(meter_data)
    }

    /// Fetch account devices from the GivEnergy API
    pub async fn get_account_devices(&self, account_id: &str, page: u32) -> Result<AccountResponse> {
        let url = format!("{}/communication-device?page={}", API_BASE_URL, page);
        log::info!("Making API request: GET {} (account_id: {}, page: {})", url, account_id, page);
        
        let response = self
            .client
            .get(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .send()
            .await
            .map_err(|e| {
                log::error!("Network error while fetching account devices for account_id {}: {}", account_id, e);
                e
            })?;

        let status = response.status();
        if !status.is_success() {
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            log::error!("API request failed: GET {} - Status: {} - Error: {}", url, status, error_text);
            anyhow::bail!("API request failed with status {}: {}", status, error_text);
        }

        log::info!("API request successful: GET {} - Status: {}", url, status);
        let devices_data: AccountResponse = response.json().await.map_err(|e| {
            log::error!("Failed to parse account devices JSON for account_id {}: {}", account_id, e);
            e
        })?;
        Ok(devices_data)
    }
}