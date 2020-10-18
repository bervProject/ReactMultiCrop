// in src/App.js
import * as React from "react";
import {
  Admin,
  Resource,
  Create,
  SimpleForm,
  ImageInput,
  List,
  Datagrid,
  TextField,
} from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import ReactMultiCrop from "./ReactMultiCrop";

const CreateForm = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <ImageInput source="image" />
      <ReactMultiCrop id="canvas" source="crop" />
    </SimpleForm>
  </Create>
);

const ListPost = (props: any) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
    </Datagrid>
  </List>
);

const dataProvider = simpleRestProvider("https://jsonplaceholder.typicode.com");
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="posts" list={ListPost} create={CreateForm} />
  </Admin>
);

export default App;
