# Overview
Smart Farm Prediction is a cross-platform application designed to provide seamless user experiences on Android, iOS, web, and Windows platforms. Built using Flutter, it ensures consistent performance and user interfaces across all supported devices.


## Features
- **Cross-Platform Support**: Runs on Android, iOS, web, and Windows.
- **Unified Codebase**: A single Flutter codebase powers all platforms.
- **Customizable Interface**: Platform-specific code sections enable tailored user experiences.
- **Modular Architecture**: Cleanly organized directories for platform-specific development.


## Directory Structure
```
.
└── fc_edge24
    ├── android
    │   └── app
    │       └── src
    │           └── main
    │               └── kotlin
    │                   └── com
    │                       └── edgeai
    │                           └── fc_edge24
    │                               └── MainActivity.kt
    ├── ios
    │   └── Runner
    │       └── Base.lproj
    │           ├── LaunchScreen.storyboard
    │           └── Main.storyboard
    ├── web
    │   └── index.html
    └── windows
        └── runner
            ├── flutter_window.cpp
            ├── main.cpp
            ├── utils.cpp
            └── win32_window.cpp
```

## Getting Started
### Prerequisites
- [Flutter SDK](https://flutter.dev/docs/get-started/install) installed.
- Android Studio or Xcode for mobile development.
- Node.js and npm for web development.
- Visual Studio for Windows development.

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/fc_edge24.git
    cd fc_edge24
    ```
2. Get Flutter dependencies:
    ```bash
    flutter pub get
    ```
    


# Acknowledgement
* This work was supported by Institute of Information & communications Technology Planning & Evaluation (IITP) grant funded by the Korea government(MSIT) (No. 2021-0-00907, Development of Adaptive and Lightweight Edge-Collaborative Analysis Technology for Enabling Proactively Immediate Response and Rapid Learning).