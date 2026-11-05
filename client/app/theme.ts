import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: { main: '#d04e97', light: '#d872ac' },
        secondary: { main: '#b0dee9'},
        background: { paper: '#fdedc9', default: '#f6e4ed' },
        text: { primary: '#5c5c5c'},
    },
    shape: {
        borderRadius: 24,
    },
    components: {
        MuiMenuItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: 'white',
                    '&:hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                    '&.Mui-selectted': {
                        backgroundColor: theme.palette.primary.light,
                    },
                    '&.Mui-selected:hover, &.Mui-selected.Mui-focusVisible': {
                        backgroundColor: theme.palette.primary.light,
                    },
                }),
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.main,
                })
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                    '& .MuiSelect-icon': { color: 'white' },
                }),
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: theme.shape.borderRadius,
                    '& .MuiInputBase-input': { color: 'white' },

                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },

                    '& .MuiFormLabel-root': { color: 'white' },
                    '& .MuiFormLabel-root.Mui-focused': { color: 'white' },
                }),
            },
        },
        MuiCssBaseline: {
            styleOverrides: (theme) => ({
                '*::-webkit-scrollbar': { width: 8 },
                '*::-webkit-scrollbar-track': { background: 'transparent' },
                '*::-webkit-scrollbar-thumb': {
                    background: theme.palette.primary.main,
                    borderRadius: 4,
                },
                '*::-webkit-scrollbar-thumb:hover': {
                    background: theme.palette.primary.light,
                },
            }),
        },
    },

});