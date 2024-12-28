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


### Running the Application
#### Android
1. Open the project in Android Studio.
2. Connect an Android device or start an emulator.
3. Run the application using:
    ```bash
    flutter run -d android
    ```

#### iOS
1. Open `ios/Runner.xcworkspace` in Xcode.
2. Select a simulator or connect an iOS device.
3. Build and run the project using:
    ```bash
    flutter run -d ios
    ```

#### Web
1. Ensure you have a web server or Flutter's web tool enabled.
2. Run the application in the browser:
    ```bash
    flutter run -d web
    ```

#### Windows
1. Open the project in Visual Studio.
2. Build the project using:
    ```bash
    flutter run -d windows
    ```

## Platform-Specific Details
### Android
The Android entry point is defined in `MainActivity.kt`, which extends `FlutterActivity` to integrate Flutter into the Android platform.

### iOS
Storyboard files (`LaunchScreen.storyboard` and `Main.storyboard`) define the user interface for the iOS platform, providing a smooth transition into the Flutter app.

### Web
The web entry point is `index.html`, which sets up the environment and links necessary resources for the Flutter web application.

### Windows
The Windows entry point is `main.cpp`, which initializes the Flutter engine and configures the application window.

## Contributing
1. Fork the repository.
2. Create a feature branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add a new feature"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.


# Acknowledgement
* This work was supported by Institute of Information & communications Technology Planning & Evaluation (IITP) grant funded by the Korea government(MSIT) (No. 2021-0-00907, Development of Adaptive and Lightweight Edge-Collaborative Analysis Technology for Enabling Proactively Immediate Response and Rapid Learning).