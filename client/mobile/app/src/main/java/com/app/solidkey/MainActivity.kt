package com.app.solidkey

import android.annotation.SuppressLint
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import com.app.solidkey.screens.LoginScreen
import com.app.solidkey.ui.theme.SolidkeyTheme

class MainActivity : ComponentActivity() {
  @SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      SolidkeyTheme {
        Scaffold(
          modifier = Modifier
            .fillMaxSize()
            .fillMaxHeight()
        ) {
          LoginScreen(
            modifier = Modifier

              .fillMaxHeight()
          )
        }
      }
    }
  }
}


