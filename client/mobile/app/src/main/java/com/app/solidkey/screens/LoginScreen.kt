package com.app.solidkey.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.app.solidkey.R
import com.app.solidkey.ui.theme.StatusBarColor

@Composable
fun LoginScreen(modifier: Modifier = Modifier) {
  val robotoCondensed = FontFamily(Font(R.font.roboto_condensed_regular))
  val interExtraBold = FontFamily(Font(R.font.inter_extrabold))

  StatusBarColor(
    statusBarColor = Color.Transparent,
    navigationBarColor = Color.Transparent,
    isLightIcons = true
  )
  Column(modifier = modifier) {
    Column(
      modifier = Modifier
        //.clip(shape = RoundedCornerShape(10.dp)) // Bordes redondeados en la columna
        .fillMaxWidth()
    ) {
      Image(
        painter = painterResource(id = R.drawable.bg),
        contentDescription = "Background",
        modifier = Modifier
          .clip(
            shape = RoundedCornerShape(
              bottomStart = 30.dp,
              bottomEnd = 30.dp
            )
          ) // Bordes redondeados en la imagen
          .fillMaxWidth()
          .height(400.dp),
        contentScale = ContentScale.Crop // Ajuste para que no sobresalga
      )
      Column(
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
      ) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.Center,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            "SolidKey",
            modifier = Modifier.padding(top = 10.dp),
            style = TextStyle(
              fontSize = 50.sp,
              fontWeight = FontWeight.Bold,
              fontFamily = interExtraBold
            )
          )
          Box(
            modifier = Modifier
              .padding(0.dp)
              .clip(shape = RoundedCornerShape(10.dp))
              .background(color = Color(0xFF1A1D21))
          ) {
            Text(
              "Auth",
              style = TextStyle(
                fontSize = 15.sp,
                color = Color(0xFF4CAF50),
                fontFamily = robotoCondensed
              ),
              modifier = Modifier.padding(5.dp)
            )
          }
        }
        Text(
          "Password generator and storage",
          style = TextStyle(fontFamily = robotoCondensed, color = Color.Gray)
        )
      }
    }
  }
}
