import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import './Card.css';


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

function Char() {

    let [character, setCharacter] = useState([]);
    let [currSearchText, setCurrSearchText] = useState('');
    let [currPage, setCurrPage] = useState(1);
    let [currCategory, setCurrCategory] = useState('All');
    let [quotes, setQuotes] = useState([]);
    const [open, setOpen] = React.useState(false);

    let [profile, setProfile] = useState({});
    
    const handleClickOpen = (id) => {
        setOpen(true);
        filteredArr.map((obj) => {
            if(obj.char_id == id){
                console.log(id);
                let str = " "
                quotes.forEach((ele) => {
                    
                    if(ele.author == obj.name){
                        
                        str = ele.quote + "#" + str
                    }
                })
                console.log(obj.appearance);
                let temp = {
                    "char_id" : obj.id,
                    "name" : obj.name,
                    "birthday" : obj.birthday,
                    "occupation" : obj.occupation,
                    "img" : obj.img,
                    "status" : obj.status,
                    "nickname" : obj.nickname,
                    "appearance" : obj.appearance,
                    "portrayed" : obj.portrayed,
                    "category" : obj.category,
                    "better_call_saul_appearance" : obj.better_call_saul_appearance,
                    "quote" : str

                }
                setProfile(temp);
            }  
        })
    };

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        axios.get('https://www.breakingbadapi.com/api/quotes')
            .then(({ data }) => {
                setQuotes(data)
                console.log(data);
            })

        axios.get(`https://www.breakingbadapi.com/api/characters`)
            .then(({ data }) => {
                setCharacter(data);
                console.log(data);
            })
    }, [])
    const handleChange = (e) => {
        let val = e.target.value;
        console.log(val);
        setCurrSearchText(val);
    }

    const handlePageChange = (pageNumber) => {
        setCurrPage(pageNumber)
    }

    const handleGenreChange = (category) => {
                setCurrCategory(category)
            }

    let filteredArr = [];
    if (currSearchText === '') {
        filteredArr = character;
    }
    else {
        filteredArr = character.filter(function (nameObj) {
            let name = nameObj.name.toLowerCase();
            console.log(name);
            return name.includes(currSearchText.toLowerCase());
        })
    }
    if (currCategory != 'All') {
        filteredArr = filteredArr.filter(function (nameObj) {
            return nameObj.category == currCategory
        })
    }
    let limit = 10;
    let numberofPage = Math.ceil(filteredArr.length / limit);
    let pageNumberArr = [];
    for (let i = 0; i < numberofPage; i++) {
        pageNumberArr.push(i + 1);
    }
    let si = (currPage - 1) * limit;
    let ei = si + limit;
    character = filteredArr.slice(si, ei);

    return (
        <div>
            <input className="input" type='search' value={currSearchText} onChange={handleChange} placeholder ="Search..." ></input>
            <Button color="primary" onClick = {()=>{handleGenreChange("All")}}>All</Button>
            <Button color="primary" onClick = {()=>{handleGenreChange("Breaking Bad")}}>Breaking Bad</Button>
            <Button  color="primary" onClick = {()=>{handleGenreChange("Better Call Saul")}}>Better Call Saul</Button>
            {
                character.length == 0 ?
                    <div>"loading... "</div> :

                    <div class="card_container">


                        {character.map((obj) => {

                            return (

                                <div class="containers">
                                    <div class="cellphone-container">
                                        <div class="char">
                                            <div class="char-img" style={{ backgroundImage: `url(${obj.img})` }}></div>
                                            <div class="text-char-cont">
                                                <div class="mr-grid">
                                                    <div class="col1">
                                                        <h1 class="heading" >{obj.name}</h1>
                                                        <ul class="nickname">
                                                            <li>{obj.nickname != null ? `( ${obj.nickname} )` : 'na'}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button variant="outlined" color="primary" onClick={() => {handleClickOpen(obj.char_id)}}>
                                                        More Info
                                                    </Button>
                                                    
                                                    <Dialog className ="dialog" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                                                        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                                                           <b>{profile.name}</b> 
                                                        </DialogTitle>

                                                        <DialogContent className ="content" dividers>
                                                            <Typography gutterBottom>
                                                                    {console.log(profile.appearance)}
                                                                   <b>Appearance </b>: {profile.appearance && profile.appearance.map((a)=>{
                                                                       return(
                                                                           <span>{a}, </span>
                                                                       )
                                                                   })}
                                                            </Typography>
                                                            <Typography gutterBottom>
                                                                
                                                                   <b>Occupation</b> : {profile.occupation &&  profile.occupation.map((a)=>{
                                                                       return(
                                                                           <span>{a}, </span>
                                                                       )
                                                                   })}
                                                                   
                                                            </Typography>
                                                            <Typography gutterBottom>
                                                                {/*  == alive ? <p>Alive</p> : <p>Dead</p> */}
                                                                <b>Status</b> : {profile.status}
                                                            </Typography>
                                                            { profile.nickname != "" ?
                                                            <Typography gutterBottom>
                                                                   <b>Nickname</b> : {profile.nickname}
                                                            </Typography>
                                                             :<span>NA</span>}
                                                            <Typography gutterBottom>
                                                                   <b>Portrayed By</b> : {profile.portrayed}
                                                            </Typography>
                                                            <Typography gutterBottom>
                                                                   <b>Category</b> : {profile.category}
                                                            </Typography>
                                                            <Typography gutterBottom>
                                                                
                                                                   <b>Quote</b> : {profile.quote && profile.quote.split('#').map((a)=>{
                                                                       return(
                                                                           <li>{a}</li>
                                                                       )
                                                                   })}
                                                            </Typography>
                                                            
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        }

                    </div>

            }
            <div className="container">
                <nav aria-label="...">
                    <ul className="pagination">
                        {
                            pageNumberArr.map((pageNumber) => {
                                let classStyle = pageNumber == currPage ? 'page-item active' : 'page-item';
                                return (
                                    <li key={pageNumber} onClick={() => handlePageChange(pageNumber)}
                                        className={classStyle}><span className="page-link">{pageNumber}</span></li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Char
