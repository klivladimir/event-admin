import { ArrowBack } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';

function TopBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'var(--surface)',
          color: 'black',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            component={Link}
            to="/"
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <div className="font-[400] text-[22px] leading-[28px] text-fg-primary">
            Создание ивента
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopBar;
