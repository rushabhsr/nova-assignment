import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const KPIStats = ({ totalUsers, approvedKYCs, pendingKYCs, rejectedKYCs }) => {
  const stats = [
    { label: "Total Users", value: totalUsers },
    { label: "Approved KYCs", value: approvedKYCs },
    { label: "Pending KYCs", value: pendingKYCs },
    { label: "Rejected KYCs", value: rejectedKYCs },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6">{stat.label}</Typography>
              <Typography variant="h4">{stat.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KPIStats;
