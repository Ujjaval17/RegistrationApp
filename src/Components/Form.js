import React, { useEffect, useState } from 'react'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import uniq from "lodash/uniq";
import _ from 'lodash';
import axios from 'axios';
//const axios = require('axios');


const Form = () => {

    const[userReg, setUserReg] = useState({
        firstname:'',
        lastname: '',
        email: '',
        phonenumber: '',
        gender: '',
        dob: '',
        address: '',
        address2: '',
        pincode: '',
        village: '',
        district: '',
        state: '',
        loadOpen: false,
        pincodesArray: []
    }
    );
    useEffect(() => {
      const fetchData = async () => {
        var root =
          "https://parseapi.back4app.com/classes/Dataset_India_Pin_Code?limit=50&where=" +
          encodeURIComponent(
            JSON.stringify({
              countryCode: "IN",
            })
          );

        console.log("test", root);

        // Make a GET request
        var headers = {
          headers: {
            "X-Parse-Application-Id":
              "G7Z8d2KcYmU0WsiPgFIZS43FUBLvarKdx5MtgyLs", // This is the fake app's application id
            "X-Parse-Master-Key": "TRxCvj4TyIJFd2NBs5XyXeQxAqUpm7SageFJ2sUZ", // This is the fake app's readonly master key
          },
        };
        axios
          .get(root, headers)
          .then((response) => {
            console.log("data", response.data);
            const distintValues = _.uniqBy(response.data.results, "postalCode");
            console.log(distintValues);
            setUserReg({ pincodesArray: distintValues });
            setTimeout(() => {}, 3000);

            console.log(userReg);
          })
          .catch((e) => {
            console.log("error", e);
          });
      };
      fetchData();
    }, []);

  const handleChange = (event) => {

    setUserReg({ gender: event.target.value })
    console.log(event.target.value)

  }

  const handleChangePincode = (event) => {

    setUserReg({ pincode: event.target.value, loadOpen: true })

    console.log(event.target.value)


    axios.get('https://api.postalpincode.in/pincode/' + event.target.value,)
      .then(function (response) {
        if (response) {
          console.log(response.data[0]);
          console.log(response.data[0].PostOffice[1]);
          setUserReg({ village: response.data[0].PostOffice[0].Block, district: response.data[0].PostOffice[0].District, state: response.data[0].PostOffice[0].State, loadOpen: false })
        }
        else {
          console.log('error');
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

  
    return (
      <div className="row m-4">
        <div className="col-md-4 mx-auto">
          <Card variant="outlined">
            <CardContent>
              <h2 className='text-center'>Sign Up Form</h2>

              <div className='row'>
                <div className='col-md-6 mt-3'>
                  <TextField id="outlined-basic" fullWidth label="First Name" required variant="outlined" />
                </div>

                <div className='col-md-6 mt-3'>
                  <TextField id="outlined-basic" fullWidth label="Last Name" required variant="outlined" />
                </div>

                <div className='col-md-6 mt-3'>
                  <TextField id="outlined-basic" fullWidth label="Email" required variant="outlined" />
                </div>

                <div className='col-md-6 mt-3'>
                  <TextField id="outlined-basic" inputProps={{ maxLength: 10 }} fullWidth label="Phone" required variant="outlined" error={false} helperText="" />
                </div>

                <div className='col-md-6 mt-3'>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={userReg.gender}
                      label="Gender"
                      required
                      onChange={handleChange}
                    >
                      <MenuItem value='male'>Male</MenuItem>
                      <MenuItem value='female'>Female</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className='col-md-6 mt-3'>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DesktopDatePicker
                      label="Date desktop"
                      inputFormat="DD/MM/YYYY"
                      value={userReg.dob}
                      error={false}
                      onChange={(newValue) => {
                        setUserReg({ dob: newValue })
                      }}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </LocalizationProvider>
                </div>

                <div className='col-md-12 mt-3'>
                  <TextField id="outlined-basic" multiline maxRows={4} fullWidth label="Address 1" required variant="outlined" />
                </div>

                <div className='col-md-12 mt-3'>
                  <TextField id="outlined-basic" multiline maxRows={4} fullWidth label="Address 2" required variant="outlined" />
                </div>

                <div className='col-md-6 mt-3'>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Pincode</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={userReg.pincode}
                      label="Pincode"
                      required
                      onChange={handleChangePincode}
                    >

                      {uniq(userReg.pincodesArray).map((pincode) => (
                        <MenuItem value={pincode.postalCode}>{pincode.postalCode}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className='col-md-6 mt-3'>
                  <TextField disabled id="outlined-basic" value={userReg.village} fullWidth label="City/Village" required variant="outlined" />
                </div>

                <div className='col-md-6 mt-3'>
                  <TextField disabled id="outlined-basic" value={userReg.district} fullWidth label="District" required variant="outlined" />
                </div>

                <div className='col-md-6 mt-3'>
                  <TextField disabled id="outlined-basic" value={userReg.state} fullWidth label="State" required variant="outlined" />
                </div>

              </div>
            </CardContent>
            <CardActions>
              <Button fullWidth variant='contained' style={{ paddingTop: 8, paddingBottom: 8 }}  disableElevation>Submit</Button>
            </CardActions>
          </Card>

          {/* Loading Backdrop Start */}
          <Backdrop
            open={userReg.loadOpen}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {/* Loading Backdrop End */}
        </div>
      </div>
    );
  }

  export default Form;

