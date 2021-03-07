module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "testMatch": [
        "**/webview/test/*.+(ts|tsx|js)",
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
}