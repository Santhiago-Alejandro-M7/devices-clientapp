//import React from 'react';

import React, { useState, useEffect } from 'react';

import './App.css';

import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, TextField } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import "bootstrap/dist/css/bootstrap.min.css";



const baseUrl = 'http://localhost:3000/devices/'

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos: {
    cursor: 'pointer'
  },
  inputMaterial: {
    width: '100%'
  }

}));



function App() {

  const styles = useStyles();
  const [data, setData] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [dropdown, setDropDown] = useState(false);


  const [usuario, setUsuario] = useState([]);
  const [tablaUsuario, setTablaUsuario] = useState([]);
  const [busqueda, setBusqueda] = useState();

  //////////////////////////////////////////////////////

  const [system_name, setNombreSys] = useState("");
  const [type, setTypeSys] = useState("ssss");
  const [hdd_capacity, setHddSys] = useState("");


  const [deviceSelected, setDeviceSelected] = useState({
    system_name,
    type,
    hdd_capacity

  })

  const handleChange = e => {
    const { name, value } = e.target;
    setDeviceSelected(prevState => ({
      ...prevState,
      [name]: value
    }))
    console.log(deviceSelected);
  }

  const handleChange2 = e => {

    setBusqueda(e.target.value);
    filtrar(e.target.value);
  }

  const filtrar = (terminoBusqueda) => {
    var resultadoBusqueda = data.filter((elemento) => {
      console.log("----->" + elemento.type);
      console.log("-------------->" + terminoBusqueda);
      if (elemento.system_name.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
        || elemento.hdd_capacity.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
        || elemento.type.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setUsuario(resultadoBusqueda);
  }


  // ****************************** PETICIONES ********************************
  const peticionGet = async () => {
    await axios.get(baseUrl)
      .then(response => {

        setData(response.data);
        setUsuario(response.data);
        setTablaUsuario(response.data);

      })
      .catch(error => {
        console.log(error);
      })
  }

  const onSendForm = (e) => {

    axios.post(baseUrl, { system_name, type, hdd_capacity })
      .then((response) => {
        setData(data.concat(response.data))
        console.log("---->>" + response);
      });
    openCloseModalAdd()
    window.location.reload(true)
  }

  const peticionPut = async () => {
    await axios.put(baseUrl + deviceSelected.id, deviceSelected)
      .then(response => {
        var auxData = data;
        auxData.map(device => {
          if (deviceSelected.id === device.id) {
            device.system_name = deviceSelected.system_name;
            device.type = deviceSelected.type;
            device.hdd_capacity = deviceSelected.hdd_capacity;
          }
        })
        setData(auxData);
        openCloseModalEdit();
      })
  }

  const peticionDelete = async () => {

    await axios.delete(baseUrl + deviceSelected.id)
      .then(response => {
        setData(data.filter(device => device.id !== deviceSelected.id));
        console.log("---->>" + response);
        openCloseModalDelete();
        window.location.reload(true)
      })
  }


  // ****************************** CONTROLLERS ********************************

  const openCloseModalAdd = () => {
    setAddModal(!addModal);
  }

  const openCloseModalEdit = () => {
    setEditModal(!editModal);
  }

  const openCloseModalDelete = () => {
    setDeleteModal(!deleteModal);
  }

  const seleccionarDispositivo = (dispositivo, caso) => {
    setDeviceSelected(dispositivo);
    (caso === 'Editar') ? openCloseModalEdit() : openCloseModalDelete()

  }

  const handleDiskCapacity = ({ target: { value } }) => {
    if (value.match(/^[0-9\b]+$/g)) {
      setHddSys(value);
    }
  }

  useEffect(async () => {
    await peticionGet();
  }, [])

  // ****************************** MODALS ********************************
  const bodyInsertar = (

    <div className={styles.modal}>
      <h6 class="display-6 text-center" >Add new device</h6>
      <form onSubmit={onSendForm}>
        <label> System Name</label>
        <input onChange={({ target: { value } }) => setNombreSys(value)} value={system_name} className="form-control" />
        <br />
        <label>Type System</label>
        <select onChange={({ target: { value } }) => setTypeSys(value)} value={type} class="form-select">
          <option value="WINDOWS_WORKSTATION"> Windows Workstation</option>
          <option value="MAC">Mac</option>
          <option value="WINDOWS_SERVER">Windows Server</option>

        </select><br />
        <label> HDD capacity</label><br />
        <input onChange={handleDiskCapacity} value={hdd_capacity} className="form-control" placeholder="Only numbers is accepted" />
        <br />

      </form>
      <div class="container">
        <div class="row">
          <div class="col text-center">
            <button className="btn btn-success" color="primary" onClick={() => onSendForm()}>Insert Device</button>
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            <button className="btn btn-secondary" color="danger" onClick={() => openCloseModalAdd()}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cancel&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
          </div>
        </div>
      </div>
      {/* <div> Form data: {JSON.stringify({system_name,type,hdd_capacity})}</div> */}
    </div>

  )


  const bodyEditar = (
    <div className={styles.modal}>
      <h3 class="display-6 text-center" >Edit Device</h3>
      <TextField name="system_name" className="form-control" label="System Name" onChange={handleChange} value={deviceSelected && deviceSelected.system_name} />
      <br />

      <TextField name="type" className={styles.inputMaterial} label="Type" onChange={handleChange} value={deviceSelected && deviceSelected.type} />
      <br />
      <TextField name="hdd_capacity" type="number" className={styles.inputMaterial} label="HDD Capacity        (Only numbers is accepted)" onChange={handleChange} value={deviceSelected && deviceSelected.hdd_capacity} />

      <div align="right">
        <button className="btn btn-primary" color="primary" onClick={() => peticionPut()}>Update Device</button>
        &nbsp;
        &nbsp;
        &nbsp;
        <button className="btn btn-danger" color="danger" onClick={() => openCloseModalEdit()}>Cancel</button>

      </div>
    </div>
  )

  const bodyEliminar = (
    <div className={styles.modal}>
      <p>Are you really want delete this device <b>{deviceSelected && deviceSelected.system_name}</b> ? </p>

      <div align="right">
        <button className="btn btn-danger" color="secondary" onClick={() => peticionDelete()}>Yes I'm Sure</button>
        &nbsp;
        &nbsp;
        &nbsp;
        <button className="btn btn-primary" onClick={() => openCloseModalDelete()}>Cancel</button>

      </div>
    </div>
  )


  // ===============================================================================================    

  return (
    <div className="App">
      <h2 class="display-6 text-center"> Device Client</h2>

      <br />
      <br /><br />
      <div className="containerInput">
        <button className="btn btn-success" onClick={() => openCloseModalAdd()}>Add new Device</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          className="form-control inputBuscar"
          value={busqueda}
          placeholder="Search by: System name, Type or HHD capacity"
          onChange={handleChange2}
        />
        <button className="btn btn-success">
          <FontAwesomeIcon icon={faSearch} />
        </button>

      </div>
      <TableContainer>
        <Table>
          <TableHead className="encabezado">
            <TableRow>
              <TableCell ><b>SYSTEM NAME</b></TableCell>
              <TableCell ><b>TYPE</b></TableCell>
              <TableCell ><b>HDD Capacity</b></TableCell>
              <TableCell ><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usuario && usuario.map(device => (
              <TableRow key={device.id}>
                <TableCell>{device.system_name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.hdd_capacity} GB</TableCell>
                <TableCell>
                  <Edit className={styles.iconos} onClick={() => seleccionarDispositivo(device, 'Editar')} />
                  &nbsp;&nbsp;&nbsp;
                  <Delete className={styles.iconos} onClick={() => seleccionarDispositivo(device, 'Eliminar')} />

                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Modal open={addModal} onClose={openCloseModalAdd}>
        {bodyInsertar}
      </Modal>

      <Modal open={editModal} onClose={openCloseModalEdit}>
        {bodyEditar}
      </Modal>

      <Modal open={deleteModal} onClose={openCloseModalDelete}>
        {bodyEliminar}
      </Modal>

    </div>
  );
}


export default App;