
import { useState } from 'react';
import { Link } from "react-router-dom";
import CasesIcon from '@mui/icons-material/Cases';
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from '@/components/FlexBetween';

const Navbar = () => {
    const { palette } = useTheme();
    const [selected, setSelected] = useState("dashboard");

    return (
        <FlexBetween
            sx={{
                mb: "0.25rem",
                p: "0.5rem 0rem",
                color: palette.grey[300]
            }}
        >
            {/* Left side */}
            <FlexBetween sx={{ gap: "0.75rem" }}>
                <CasesIcon sx={{ fontSize: "30px" }} />
                <Typography variant="h4" sx={{ fontSize: "16px" }}>
                    Finsight
                </Typography>
            </FlexBetween>

            {/* Right side */}
            <FlexBetween sx={{ gap: "2rem" }}>
                <Box
                    sx={{
                        "& a": {
                            color: selected === "dashboard"
                                ? "inherit"
                                : palette.grey[700],
                            textDecoration: "inherit"
                        },
                        "& a:hover": {
                            color: palette.primary[100]
                        }
                    }}
                >
                    <Link
                        to="/"
                        onClick={() => setSelected("dashboard")}
                    >
                        Dashboard
                    </Link>
                </Box>

                <Box
                    sx={{
                        "& a": {
                            color: selected === "predictions"
                                ? "inherit"
                                : palette.grey[700],
                            textDecoration: "inherit"
                        },
                        "& a:hover": {
                            color: palette.primary[100]
                        }
                    }}
                >
                    <Link
                        to="/predictions"
                        onClick={() => setSelected("predictions")}
                    >
                        Predictions
                    </Link>
                </Box>
            </FlexBetween>
        </FlexBetween>
    );
};

export default Navbar;
