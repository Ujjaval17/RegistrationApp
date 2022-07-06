import React, { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import uniq from "lodash/uniq";
import _ from "lodash";
import axios from "axios";
import './Form.css';
//const axios = require('axios');

const Form = () => {
  const [userReg, setUserReg] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    gender: "",
    dob: "",
    address: "",
    address2: "",
    pincode: "",
    village: "",
    district: "",
    state: "",
    loadOpen: false,
    pincodesArray: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [post, setPost] = useState(true);

  const inputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserReg({ ...userReg, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      var root =
        "https://parseapi.back4app.com/classes/Dataset_India_Pin_Code?limit=20&where=" +
        encodeURIComponent(
          JSON.stringify({
            countryCode: "IN",
          })
        );

      console.log("test", root);

      // Make a GET request
      var headers = {
        headers: {
          "X-Parse-Application-Id": "G7Z8d2KcYmU0WsiPgFIZS43FUBLvarKdx5MtgyLs", // This is the fake app's application id
          "X-Parse-Master-Key": "TRxCvj4TyIJFd2NBs5XyXeQxAqUpm7SageFJ2sUZ", // This is the fake app's readonly master key
        },
      };
      axios
        .get(root, headers)
        .then((response) => {
          //console.log("data", response.data);
          const distintValues = _.uniqBy(response.data.results, "postalCode");
         // console.log(distintValues);
          setUserReg({ ...userReg, pincodesArray: distintValues });
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
    setUserReg({ ...userReg, gender: event.target.value });
    console.log(event.target.value);
  };

  const handleChangePincode = (event) => {
    const pincode = event.target.value;
    setUserReg({ ...userReg, pincode: pincode, loadOpen: true });

    console.log(event.target.value);

    axios
      .get("https://api.postalpincode.in/pincode/" + event.target.value)
      .then(function (response) {
        if (response) {
          console.log(response.data[0]);
          console.log(response.data[0].PostOffice[1]);
          setUserReg({
            ...userReg,
            pincode: pincode,
            village: response.data[0].PostOffice[0].Block,
            district: response.data[0].PostOffice[0].District,
            state: response.data[0].PostOffice[0].State,
            loadOpen: false,
          });
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReset = () => {
    setUserReg({
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      gender: "",
      dob: "",
      address: "",
      address2: "",
      pincode: "",
      city: "",
      district: "",
      state: "",
    });

    setIsSubmit(false);
    setFormErrors('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(userReg);
    const newRecord = { ...userReg, id: Math.random.toString() };
    //console.log(newRecord);
    //setRecords({...records, newRecord});
    //console.log(records);

    setUserReg({
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      gender: "",
      dob: "",
      address: "",
      address2: "",
      pincode: "",
      village: "",
      district: "",
      state: "",
    });

    setFormErrors(validate(userReg));
    setIsSubmit(true);

    if (post) {
      axios
        .post("https://jsonplaceholder.typicode.com/posts", { newRecord })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      // console.log(userReg);
    }
  }, [formErrors, isSubmit]);
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regex1 = /^[a-zA-Z ]*$/;

    if (!values.firstname) {
      errors.firstname = "Username is required!";
      setPost(false);
    }
    if (!regex1.test(values.lastname)) {
      errors.lastname = "enter only charecters";
      setPost(false);
    }

    if (!values.gender) {
      errors.gender = "Gender is required";
      setPost(false);
    }

    if (!values.phonenumber) {
      errors.phonenumber = "phonenumber is required";
      setPost(false);
    } else if (values.phonenumber.length !== 10) {
      errors.phonenumber = "phonenumber is not valid";
      setPost(false);
    }

    if (!values.email) {
      errors.email = "Email is required!";
      setPost(false);
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
      setPost(false);
    }
    if (!values.pincode) {
      errors.pincode = "Pincode must be 6 digit";
      setPost(false);
    } else if (values.pincode.length !== 6) {
      errors.pincode = "Pincode is required";
      setPost(false);
    }

    if (!values.village) {
      errors.village = "City/Village is required!";
      setPost(false);
    }

    if (!values.district) {
      errors.district = "District is required!";
      setPost(false);
    }

    if (!values.state) {
      errors.state = "State is required!";
      setPost(false);
    }

    return errors;
  };

  return (
    <form>
    <div className="row m-4">
      <div className="col-md-4 mx-auto">
        <Card variant="outlined">
          <CardContent>
            <h2 className="text-center">Sign Up Form</h2>

            <div className="row">
              <div className="col-md-6 mt-3">
                <TextField
                  onChange={inputHandler}
                  name="firstname"
                  value={userReg.firstname}
                  id="outlined-basic"
                  fullWidth
                  label="First Name"
                  required
                  variant="outlined"
                />
                <p>{formErrors.firstname}</p>
              </div>

              <div className="col-md-6 mt-3">
                <TextField
                  onChange={inputHandler}
                  name="lastname"
                  value={userReg.lastname}
                  id="outlined-basic"
                  fullWidth
                  label="Last Name"
                  required
                  variant="outlined"
                />
                <p>{formErrors.lastname}</p>
              </div>

              <div className="col-md-6 mt-3">
                <TextField
                  onChange={inputHandler}
                  value={userReg.email}
                  name="email"
                  id="outlined-basic"
                  fullWidth
                  label="Email"
                  required
                  variant="outlined"
                />
                <p>{formErrors.email}</p>
              </div>

              <div className="col-md-6 mt-3">
                <TextField
                  onChange={inputHandler}
                  value={userReg.phonenumber}
                  name="phonenumber"
                  id="outlined-basic"
                  inputProps={{ maxLength: 10 }}
                  fullWidth
                  label="Phone"
                  required
                  variant="outlined"
                  error={false}
                  helperText=""
                />
                <p>{formErrors.phonenumber}</p>
              </div>

              <div className="col-md-6 mt-3">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="gender"
                    value={userReg.gender}
                    label="Gender"
                    required
                    onChange={handleChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
                <p>{formErrors.gender}</p>
              </div>

              <div className="col-md-6 mt-3">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DesktopDatePicker
                    label="Date of Birth"
                    inputFormat="DD/MM/YYYY"
                    name="dob"
                    defaultValue=""
                    error={false}
                    onChange={(newValue) => {
                      setUserReg({ ...userReg.dob, newValue });
                    }}
                    value={userReg.dob}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>

              <div className="col-md-12 mt-3">
                <TextField
                  onChange={inputHandler}
                  name="address"
                  value={userReg.address}
                  id="outlined-basic"
                  multiline
                  maxRows={4}
                  fullWidth
                  label="Address 1"
                  required
                  variant="outlined"
                />
              </div>

              <div className="col-md-12 mt-3">
                <TextField
                  onChange={inputHandler}
                  value={userReg.address2}
                  name="address2"
                  id="outlined-basic"
                  multiline
                  maxRows={4}
                  fullWidth
                  label="Address 2"
                  required
                  variant="outlined"
                />
              </div>

              <div className="col-md-6 mt-3">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Pincode</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="pincode"
                    value={userReg.pincode}
                    label="Pincode"
                    required
                    onChange={handleChangePincode}
                  >
                    {uniq(userReg.pincodesArray).map((pincode) => (
                      <MenuItem value={pincode.postalCode}>
                        {pincode.postalCode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <p>{formErrors.pincode}</p>
              </div>
            
              <div className="col-md-6 mt-3">
                <TextField
                  disabled
                  id="outlined-basic"
                  name="village"
                  value={userReg.village}
                  fullWidth
                  label="City/Village"
                  required
                  variant="outlined"
                />
                <p>{formErrors.village}</p>
              </div>

              <div className="col-md-6 mt-3">
                <TextField
                  disabled
                  id="outlined-basic"
                  name="district"
                  value={userReg.district}
                  fullWidth
                  label="District"
                  required
                  variant="outlined"
                />
                <p>{formErrors.district}</p>
              </div>

              <div className="col-md-6 mt-3">
                <TextField
                  disabled
                  id="outlined-basic"
                  name="state"
                  value={userReg.state}
                  fullWidth
                  label="State"
                  required
                  variant="outlined"
                />
                <p>{formErrors.state}</p>
              </div>
            </div>
          </CardContent>
          <CardActions>
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              style={{ paddingTop: 8, paddingBottom: 8 }}
              disableElevation
            >
              Submit
            </Button>
            <Button
              onClick={handleReset}
              fullWidth
              variant="contained"
              style={{ paddingTop: 8, paddingBottom: 8 }}
              disableElevation
            >
              Reset
            </Button>
          </CardActions>
        </Card>

        {/* Loading Backdrop Start */}
        <Backdrop open={userReg.loadOpen}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* Loading Backdrop End */}
      </div>
    </div>
    </form>
  );
};

export default Form;
