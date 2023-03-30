import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Button, Grid, Input, Spacer } from "@nextui-org/react";

const AdditionalInfo = () => {
  const [nickname, setNickname] = React.useState("");
  const [pronouns, setPronouns] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [cellNumber, setCellNumber] = React.useState("");
  const [homeNumber, setHomeNumber] = React.useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addAdditionalInfo({
        nickname: nickname,
        pronouns: pronouns,
        address: address,
        cellNumber: cellNumber,
        homeNumber: homeNumber,
      });
    }
  };

  return (
    <div className="sign-up">
      <h1>Sign-Up</h1>
      <form>
        <Grid.Container direction="column" gap={3} alignContent="left">
          <Grid>
            <Input
              label="Nickname:"
              helperText="optional"
              onChange={(e) => setNickname(e.target.value)}
            ></Input>
          </Grid>
          <Grid>
            <Input
              label="Pronouns:"
              helperText="optional"
              onChange={(e) => setPronouns(e.target.value)}
            ></Input>
          </Grid>
          <Grid>
            <Input
              label="Address:"
              helperText="optional"
              onChange={(e) => setAddress(e.target.value)}
            ></Input>
          </Grid>
          <Grid>
            <Input
              label="Cell Number:"
              helperText="optional"
              type="number"
              onChange={(e) => setCellNumber(e.target.value)}
            ></Input>
          </Grid>
          <Grid>
            <Input
              label="Home Number:"
              helperText="optional"
              type="number"
              onChange={(e) => setHomeNumber(e.target.value)}
              onKeyDown={handleKeyDown}
            ></Input>
          </Grid>
        </Grid.Container>
      </form>
      <Spacer y={2} />
      <Button
        className="sign-in"
        onClick={() =>
          addAdditionalInfo({
            nickname: nickname,
            pronouns: pronouns,
            address: address,
            cellNumber: cellNumber,
            homeNumber: homeNumber,
          })
        }
      >
        Create account
      </Button>
    </div>
  );
};

async function addAdditionalInfo(props) {
    const currUser = JSON.parse(localStorage.getItem("user"));
    let body = props;
    body.email = currUser.email;
    axios.post("http://localhost:8080/api/users/updateUser", props).then(function (response) {
      if (response.data.status === "success") {
        console.log(response);
        updateLocalStorage(props);
        window.location.href = '/calendar';
      }
    })
    .catch(function (error) {
      console.log("Error in User Profile");
      console.log(error);
      window.alert(error.response.data.message);
    });
}


async function updateLocalStorage(props) {
    const currUser = JSON.parse(localStorage.getItem("user"));
    currUser.nickname = props.nickname;
    currUser.pronouns = props.pronouns;
    currUser.address = props.address;
    currUser.cellNumber = props.cellNumber;
    currUser.homeNumber = props.homeNumber;
    // update
    localStorage.setItem("user", JSON.stringify(currUser));
  }

export default AdditionalInfo;
