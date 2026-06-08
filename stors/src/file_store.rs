use std::path::{Path, PathBuf};

use log::debug;

use tokio::fs::{read_to_string, write};

#[derive(Debug, Clone)]
pub struct FileStore {}

impl FileStore {
    const DATA: &str = "data";
    const LATEST: &str = "latest";

    pub fn new() -> FileStore {
        Self {}
    }

    fn path_data_latest() -> PathBuf {
        Path::new(FileStore::DATA).join(FileStore::LATEST)
    }

    pub async fn read_latest(&self) -> Option<String> {
        let path = Self::path_data_latest();
        // let mut file = File::open(path).await?;
        match read_to_string(path).await {
            Ok(s) => Some(s),
            Err(e) => {
                debug!("Error reading latest: {}", e);
                None
            }
        }
    }

    pub async fn write_latest(&self, body: bytes::Bytes) -> Result<(), std::io::Error> {
        let path = Self::path_data_latest();
        write(path, body).await
    }
}
