use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use anyhow::Result;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ConnectionState {
    Disconnected,
    Connecting,
    Connected,
    Disconnecting,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DashboardStatus {
    pub inverter_state: ConnectionState,
}

impl Default for DashboardStatus {
    fn default() -> Self {
        Self {
            inverter_state: ConnectionState::Disconnected,
        }
    }
}

pub struct DashboardManager {
    status: Arc<Mutex<DashboardStatus>>,
}

impl DashboardManager {
    pub fn new() -> Self {
        Self {
            status: Arc::new(Mutex::new(DashboardStatus::default())),
        }
    }

    pub async fn get_status(&self) -> Result<DashboardStatus> {
        let status: tokio::sync::MutexGuard<'_, DashboardStatus> = self.status.lock().await;
        Ok(status.clone())
    }
}
