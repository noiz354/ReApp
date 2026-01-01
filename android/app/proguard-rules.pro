# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# React Native Core
-keep class com.facebook.react.** { *; }
-keep class com.facebook.yoga.** { *; }
-keep class com.facebook.soloader.** { *; }
-keepclassmembers class * { @com.facebook.react.bridge.ReactMethod *; }

# New Architecture / Hermes
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.core.** { *; }

# React Native Video & ExoPlayer
-keep class com.brentvatne.react.** { *; }
-keep class androidx.media3.** { *; }

# React Native Maps
-keep class com.google.android.gms.maps.** { *; }
-keep class com.google.android.libraries.maps.** { *; }

# Notifee (Notifications)
-keep class app.notifee.** { *; }

# Lottie
-keep class com.airbnb.lottie.** { *; }

# Svg
-keep class com.horcrux.svg.** { *; }

# OkHttp/Networking (for Axios)
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn okhttp3.**
-dontwarn okio.**
