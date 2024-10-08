use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub struct ConfigOption {
    pub output: String,
    pub environment_identifier: String,
    pub dependencies: HashMap<String, Service>,
}

impl Default for ConfigOption {
    fn default() -> Self {
        Self {
            dependencies: HashMap::new(),
            environment_identifier: "process.env.NODE_ENV".to_string(),
            output: "./endpoints/".to_string(),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Service {
    pub version: Option<String>,
    pub repository: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workspaces: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub branch: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub exclude_periods: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub roots: Option<HashMap<String, String>>,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    #[serde(rename = "$schema")]
    schema: String,
    pub output: String,
    pub environment_identifier: String,
    pub dependencies: HashMap<String, Service>,
}

impl Config {
    pub fn new(option: ConfigOption) -> Config {
        Config {
            schema: "https://matsuri-tech.github.io/endpoints-sdk-cli/schema.json".to_string(),
            dependencies: option.dependencies,
            environment_identifier: option.environment_identifier,
            output: option.output,
        }
    }
    // workspaceが複数のケースに対応していない
    pub fn push(&mut self, name: String, service: Service) {
        self.dependencies.insert(name, service);
    }
}

#[test]
fn test_config_new() {
    let config = Config::new(ConfigOption {
        ..Default::default()
    });

    let expected = serde_json::to_string_pretty(&Config {
        schema: "https://matsuri-tech.github.io/endpoints-sdk-cli/schema.json".to_string(),
        dependencies: HashMap::new(),
        environment_identifier: "process.env.NODE_ENV".to_string(),
        output: "./endpoints/".to_string(),
    })
    .unwrap();

    assert_eq!(serde_json::to_string_pretty(&config).unwrap(), expected);
}

#[test]
fn test_config_push() {
    let mut deps = HashMap::new();
    deps.insert(
        "mes".to_string(),
        Service {
            version: Some("1.0.0".to_string()),
            repository: "git@github.com:matsuri-tech/endpoints-sdk-cli.git".to_string(),
            workspaces: None,
            branch: None,
            exclude_periods: None,
            roots: None,
        },
    );

    let mut config = Config::new(ConfigOption {
        dependencies: deps,
        environment_identifier: "process.env.NEXT_ENV".to_string(),
        output: "./src/endpoints/".to_string(),
    });

    config.push(
        "mes".to_string(),
        Service {
            version: Some("2.0.0".to_string()),
            repository: "git@github.com:matsuri-tech/endpoints-sdk-cli.git".to_string(),
            workspaces: Some(vec!["go".to_string()]),
            branch: None,
            exclude_periods: None,
            roots: None,
        },
    );

    let json = serde_json::to_string_pretty(&config).unwrap();
    let result: Config = serde_json::from_str(&json).unwrap();

    assert_eq!(
        result.dependencies["mes"].repository,
        "git@github.com:matsuri-tech/endpoints-sdk-cli.git"
    );
    assert_eq!(
        result.dependencies["mes"].version,
        Some("2.0.0".to_string())
    );
    assert_eq!(
        result.dependencies["mes"].workspaces,
        Some(vec!["go".to_string()])
    );
    assert_eq!(result.output, "./src/endpoints/");
    assert_eq!(result.environment_identifier, "process.env.NEXT_ENV");
}
