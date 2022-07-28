/**
 * Show local workspace init progress
 *
 */

import React, { useEffect, useState } from "react";

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import Layout from "@/components/Layout";

const steps = [
  'Clone source code',
  'Bootstrap service',
  'Sync local workspace files',
  'Install dependencies',
  'Start debugger',
  'Ready',
];

// TODO: parse progress id
const LocalWorkspaceInitProgress = () => {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timeId = setTimeout(() => {
      if (step < steps.length) {
        setStep(step + 1)
      }
    }, 3000)

    return () => clearInterval(timeId)
  }, [step])

  function openVSCode() {
     window.open(`vscode://forkmain.forkmain?ready=true`)
  }

  return (
    <Layout
      pageHeader="View Local Workspace Init Progress"
    >
    <p></p>
      <Stepper activeStep={step} alternativeLabel>
        {
          steps.map((label) => (
            <Step key={label}>
            <StepLabel>{label}</StepLabel>
            </Step>
          ))
        }
      </Stepper>
      <Box
        sx={{
          display: 'flex',
          marginTop: '50px',
          '& > :not(style)': {
            m: 1,
            width: 1120,
            height: 600,
            display: 'flex',
          },
          '& section': {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        }}
      >
        <Paper>
          {
            step === 0 && <section> Clone source code log</section>
          }
          {
            step === 1 && <section> Bootstraping the service </section>
          }
          {
            step === 2 && <section> Sync files...</section>
          }
          {
            step === 3 && <section> Installing dependencies </section>
          }
          {
            step === 4 && <section> Start Debugger... </section>
          }
          {
            step >= 5 && (
                <section>
                  <Button variant="contained" onClick={openVSCode}>Happy Coding!</Button>
                </section>
            )
          }
        </Paper>
      </Box>
    </Layout>
  )
}

export default LocalWorkspaceInitProgress;
