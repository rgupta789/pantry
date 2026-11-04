import { Outlet, Link, useLocation } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import { theme } from '../theme';

export default function Layout() {
    const { pathname } = useLocation();
    const current = pathname.startsWith('/recipes') ? '/recipes' : '/';
    
    return (
        <>
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            <Box sx={{  flexShrink: 0, display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={current}>
                    <Tab label="Inventory" value="/" component={Link} to="/" />
                    <Tab label="Recipes" value="/recipes" component={Link} to="/recipes" />
                </Tabs>
                {/* < Outlet /> */}
            </Box>

            <Box component="main" sx={{ flex: 1, minHeight: 1, overflowY: 'auto' }}>
                <Outlet />
            </Box>
        
        </Box>
        </>


    );

}