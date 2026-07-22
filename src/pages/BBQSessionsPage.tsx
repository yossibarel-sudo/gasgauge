import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import {
  useState,
} from "react";

import {
  BBQSessionService,
} from "../services/BBQSessionService";

import type {
  BBQSession,
} from "../models/BBQSession";



function formatDate(
  date: Date
): string {

  const day =
    String(
      date.getDate()
    ).padStart(2,"0");


  const month =
    String(
      date.getMonth()+1
    ).padStart(2,"0");


  const year =
    date.getFullYear();


  return `${day}/${month}/${year}`;
}



interface Props {

  installationId:string;

  onBack:()=>void;

}



export default function BBQSessionsPage({

  installationId,

  onBack,

}:Props){


const [
sessions,
setSessions,
]=useState<BBQSession[]>(
()=>BBQSessionService
.loadForInstallation(
installationId
)
);



function deleteSession(
id:string
){

if(
!window.confirm(
"Delete BBQ session?"
)
){
return;
}


BBQSessionService.delete(id);


setSessions(
BBQSessionService
.loadForInstallation(
installationId
)
);

}



return (

<Box
sx={{
maxWidth:900,
mx:"auto",
mt:4,
}}
>


<Typography
variant="h4"
gutterBottom
>
BBQ Sessions
</Typography>



<Card>

<CardContent>


{
sessions.length===0 ?

<Typography
color="text.secondary"
>
No BBQ sessions recorded.
</Typography>


:

<Table>

<TableHead>

<TableRow>

<TableCell>
Date
</TableCell>

<TableCell align="right">
Duration (h)
</TableCell>

<TableCell>
Notes
</TableCell>

<TableCell>
Delete
</TableCell>

</TableRow>

</TableHead>


<TableBody>

{
sessions.map(
(session)=>(

<TableRow
key={session.id}
>

<TableCell>
{
formatDate(
session.date
)
}
</TableCell>


<TableCell align="right">

{
session.durationHours
.toFixed(1)
}

</TableCell>


<TableCell>
{
session.notes
}

</TableCell>


<TableCell>

<IconButton
color="error"
onClick={()=>
deleteSession(
session.id
)
}
>

<DeleteIcon/>

</IconButton>


</TableCell>


</TableRow>

)
)
}


</TableBody>

</Table>

}

<Box
  sx={{
    display:"flex",
    justifyContent:"flex-end",
    mt:3,
  }}
>
  <Button
    variant="contained"
    onClick={onBack}
  >
    Back to Dashboard
  </Button>
</Box>

</CardContent>

</Card>


</Box>

);

}