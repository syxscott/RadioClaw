package ai.RadioClaw.app.ui

import androidx.compose.runtime.Composable
import ai.RadioClaw.app.MainViewModel
import ai.RadioClaw.app.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
