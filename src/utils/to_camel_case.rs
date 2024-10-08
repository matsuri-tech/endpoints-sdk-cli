pub fn to_camel_case(name: &str) -> String {
    let mut result = String::new();
    let mut first = false;
    for c in name.chars() {
        if first {
            result.push(c.to_ascii_uppercase());
            first = false;
        } else if c == '_' || c == '-' {
            first = true;
        } else {
            result.push(c);
        }
    }
    result
}

#[test]
fn test_to_camel_case() {
    assert_eq!("helloWorld", to_camel_case("hello-world"));
    assert_eq!("helloWorld", to_camel_case("hello_world"));
    assert_eq!("m2mCoreV1", to_camel_case("m2m-core_v1"));
}
