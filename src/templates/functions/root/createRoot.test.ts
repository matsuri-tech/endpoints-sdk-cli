import { expect, test } from "vitest";
import { createRoot } from "./createRoot";

test("Verify that createRoot works correctly", () => {
  const env = {
    dev: "http://localhost:3000",
    prod: "https://api.example.com",
  };

  expect(createRoot("process.env.NODE_ENV", env)).toBe(`
/**
 * A function that returns the URL part common to the endpoints.
 */
export const root = () => {
    let __root = "";
    
    if (process.env.NODE_ENV === "development") {       
        __root = "http://localhost:3000";
    }

    if (process.env.NODE_ENV === "production") {       
        __root = "https://api.example.com";
    }
    return __root
}`);
});

test("Verify that createRoot works correctly with overrides", () => {
  const env = {
    dev: "http://localhost:3000",
    prod: "https://api.example.com",
  };

  const overrides = {
    dev: "http://localhost:4000",
  };

  expect(createRoot("process.env.NODE_ENV", env, overrides)).toBe(`
/**
 * A function that returns the URL part common to the endpoints.
 */
export const root = () => {
    let __root = "";
    
    if (process.env.NODE_ENV === "development") {       
        __root = "http://localhost:4000";
    }

    if (process.env.NODE_ENV === "production") {       
        __root = "https://api.example.com";
    }
    return __root
}`);
});

test("想定していないenvはそのまま出力される", () => {
  const env = {
    test: "http://localhost:8080",
  };

  expect(createRoot("process.env.NODE_ENV", env)).toBe(`
/**
 * A function that returns the URL part common to the endpoints.
 */
export const root = () => {
    let __root = "";
    
    if (process.env.NODE_ENV === "test") {       
        __root = "http://localhost:8080";
    }
    return __root
}`);
});

test("envのパスの最後にあるスラッシュは削除される", () => {
  const env = {
    dev: "http://localhost:3000/",
    prod: "https://api.example.com/",
  };

  expect(createRoot("process.env.NODE_ENV", env)).toBe(`
/**
 * A function that returns the URL part common to the endpoints.
 */
export const root = () => {
    let __root = "";
    
    if (process.env.NODE_ENV === "development") {       
        __root = "http://localhost:3000";
    }

    if (process.env.NODE_ENV === "production") {       
        __root = "https://api.example.com";
    }
    return __root
}`);
});
