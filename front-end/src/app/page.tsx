import type { ReactElement } from "react";

import { Box, Button, Container, Stack, Typography } from "@mui/material";

export default function HomePage(): ReactElement {
  return (
    <Container component="main" maxWidth="sm">
      <Stack
        spacing={3}
        sx={{
          minHeight: "100dvh",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            Kakeibo
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            今月あといくら使えるかをすぐ確認するための家計簿アプリです。
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          <Button href="/login" variant="contained" size="large">
            ログインへ
          </Button>
          <Button href="/annual-summary" variant="outlined" size="large">
            年間サマリー
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
