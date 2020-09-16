import React from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Box, Grid, TextField, Typography, Button, } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux'
import { red } from '@material-ui/core/colors';

let useStyles = makeStyles({
    root: {
        maxWidth: 1920,
        height: '100vh',
        margin: 'auto',
        padding: 10
    },
    parper: {
        margin: 'auto',
        maxWidth: 350,

    }
})

export default function LoginPage() {
    let classes = useStyles()
    let history = useHistory()
    let email = React.useRef('')
    let pass = React.useRef('')

    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    //寫值
    let dispatch = useDispatch()

    function handleSubmit(e) {
        e.preventDefault();
        fetch('http://localhost:8888/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                 email: email.current,
                 password: pass.current,
               // email: `adamwang1209@gmail.com`,
                //password: `123`,
            }),
        }).then(res => {
            return res.json()
        }).then(res => {
            console.log(res['狀態'])
            if (res['狀態'] == '登入異常') {
                dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
            } else {
                dispatch({ type: 'IS_LOGIN' })
                document.cookie = `TMS=${email.current};max-age = 3600 path=/`
                history.push('/')
            }
        })
    }

    function handleEmailInput(e) {
        email.current = e.target.value
        console.log(e.target.value);
    }

    function handlePassInput(e) {
        pass.current = e.target.value
        console.log(e.target.value);
    }


    return (
        <>
            <Grid container className={classes.root} justify='center' alignContent='center' >
                <Grid item xs={12} style={{ marginBottom: 8 }}>
                    <Typography color='primary' variant='h5' align='center' >TMS 人才管理系統登入</Typography>
                </Grid>

                <Grid item xs={12} >
                    <Paper className={classes.parper}>
                        <Box p={2}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField id="outlined-basic" label="電子信箱" variant="outlined" size='small' onChange={handleEmailInput} fullWidth required />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField id="outlined-basic"  label="密碼" variant="outlined" size='small' onChange={handlePassInput} fullWidth  required/>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={1} style={{ marginTop: 10 }}>
                                    <Grid item xs={12}>
                                        <Button type='submit' color='primary' variant="contained" fullWidth>登入</Button>
                                    </Grid>

                                </Grid>
                            </form>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackBarReducer.open} autoHideDuration={3000} onClose={() => dispatch({ type: 'HIDEN' })}>
                <Alert onClose={() => dispatch({ type: 'HIDEN' })} severity={snackBarReducer.severity}>
                    {snackBarReducer.text}
                </Alert>
            </Snackbar>
        </>

    )
}