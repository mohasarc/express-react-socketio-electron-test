/**
 * @author Mohammed S. Yaseen
 * @version 6/7/2020
 */

import React from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import socketIOClient from "socket.io-client";
var socket;

class FsOperations extends React.Component{ 
    constructor(props){
        super(props);
        this.state = {
            endpoint : 'http://localhost:2000/',
            TextFieldVal1 : '',
            TextFieldVal2 : '',
            snackMessage : '',
            snackOpen : false,
            key : 0,
        }
        socket = socketIOClient('http://localhost:2000/');
    }

    componentDidMount(){
        socket.on('notification', (newData)=>{
            console.log(newData);
            // change view
            this.setState((prevState) => {
                if (typeof newData === 'string')
                    return ({snackMessage:newData, snackOpen:true, key : prevState.key+1});
            });
            var curObj = this;
            setTimeout(() => {
                curObj.setState((prevState)=>{
                    return ({snackOpen:false, key:prevState.key + 1});
                });
            }, 2000);
        });
    }

    copy = (e) => {
        console.log('emitting ', {'text1' : this.state.TextFieldVal1, 'text2' : this.state.TextFieldVal2})
        socket.emit('copy', {'text1' : this.state.TextFieldVal1, 'text2' : this.state.TextFieldVal2});
        e.preventDefault();
    }

    cut = (e) => {
        console.log('emitting ', {'text1' : this.state.TextFieldVal1, 'text2' : this.state.TextFieldVal2})
        socket.emit('cut', {'text1' : this.state.TextFieldVal1, 'text2' : this.state.TextFieldVal2});
        e.preventDefault();
    }

    rename = (e) => {
        console.log('emitting ', {'text1' : this.state.TextFieldVal1, 'text2' : this.state.TextFieldVal2})
        socket.emit('rename', {'text1' : this.state.TextFieldVal1, 'text2' : this.state.TextFieldVal2});
        e.preventDefault();
    }

    delete = (e) => {
        console.log('emitting ', {'text1' : this.state.TextFieldVal1, 'text2' : this.state.TextFieldVal2})
        socket.emit('delete', {'text1' : this.state.TextFieldVal1, 'text2' : this.state.TextFieldVal2});
        e.preventDefault();
    }

    textChanged1 = (e) => {
        this.setState({'TextFieldVal1' : e.target.value});
    }

    textChanged2 = (e) => {
        this.setState({'TextFieldVal2' : e.target.value});
    }

    handleClose = () => {
        this.setState({'open': false });
    };

    render(){
        return (
            <Container maxWidth="sm" style={{'marginTop' : '2em'}}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <TextField onChange={this.textChanged1} id="outlined-basic" label="input 1" variant="outlined"/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField onChange={this.textChanged2} id="outlined-basic" label="input 2" variant="outlined"/>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={this.copy}>
                            Copy
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={this.cut}>
                            Cut
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={this.rename}>
                            Rename
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={this.delete}>
                            delete
                        </Button>
                    </Grid>
                </Grid>
                <Snackbar
                    anchorOrigin={{ 'vertical' : 'bottom', 'horizontal' : 'center' }}
                    open={this.state.snackOpen}
                    onClose={this.handleClose}
                    message={this.state.snackMessage}
                    key={this.state.key}
                />
            </Container>
        );
    }
}

export default FsOperations;