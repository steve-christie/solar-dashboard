fn main() {
    // Standard Tauri build
    // Note: The helper binary should be placed in resources/ directory
    // BEFORE running cargo tauri build. This is handled by scripts/build-release.sh
    tauri_build::build();

    // In release builds, copy project root .env next to the binary so the built app
    // finds it when run from target/release/ (e.g. when testing the release build locally).
    // Does not affect installed/distributed apps; they use config dir or exe dir.
    #[cfg(not(debug_assertions))]
    if let (Ok(out_dir), Ok(manifest_dir)) =
        (std::env::var("OUT_DIR"), std::env::var("CARGO_MANIFEST_DIR"))
    {
        let project_root = std::path::Path::new(&manifest_dir).parent().unwrap();
        let env_src = project_root.join(".env");
        if env_src.exists() {
            // OUT_DIR is target/release/build/<pkg>-<hash>/out, so 3 levels up = target/release
            let out_path = std::path::Path::new(&out_dir);
            if let Some(target_release) = out_path.parent().and_then(|p| p.parent()).and_then(|p| p.parent()) {
                let env_dest = target_release.join(".env");
                if std::fs::copy(&env_src, &env_dest).is_ok() {
                    println!("cargo:warning=Copied .env to release output (for local run from target/release)");
                }
            }
        }
    }
}
