use std::path::{Path, PathBuf};

use log::debug;

use tokio::fs::read_to_string;
// for write_all()

pub struct FileStore {}

impl FileStore {
    const DATA: &str = "data";
    const LATEST: &str = "latest";

    // pub fn new() -> FileStore {
    //     Self {}
    // }

    fn path_data_latest() -> PathBuf {
        Path::new(FileStore::DATA).join(FileStore::LATEST)
    }

    pub async fn read_latest() -> Option<String> {
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

    // async fn write_latest() {
    //     let mut file = File::create("foo.txt").await?;
    //     file.write_all(b"hello, world!").await?;
    // }
}
