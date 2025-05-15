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
        <Toolbar disableGutters>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              paddingX: '12px',
              gap: '4px',
              width: '100%',
            }}
          >
            <IconButton
              component={Link}
              to="/"
              size="large"
              color="inherit"
              aria-label="menu"
              onClick={() => {
                localStorage.removeItem('currentEventId');
              }}
            >
              <ArrowBack />
            </IconButton>
            <div className="font-[400] text-[22px] leading-[28px] text-fg-primary">
              Создание ивента
            </div>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopBar;
