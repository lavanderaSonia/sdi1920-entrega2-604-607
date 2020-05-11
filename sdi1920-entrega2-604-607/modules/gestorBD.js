module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    /**
     * Función que nos permite obtener la lista de usuarios según criterio pasado como parámetro
     * @param criterio criterio que le pasamos para buscar usuarios
     * @param funcionCallback
     */
    obtenerUsuarios: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.find(criterio).toArray(function (err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Función que permite insertar los usuarios en base de datos
     * @param usuario usuario que queremos insertar
     * @param funcionCallback
     */
    insertarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.insertOne(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Función que me permite obtener los usuarios de la aplicación paginados
     * @param criterio por el que queremos buscar
     * @param pg número de páginas
     * @param funcionCallback
     */
    obtenerUsuariosPg: function (criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5).toArray(function (err, usuarios) {
                        if (err) {
                            funcionCallback(null);
                        } else {
                            funcionCallback(usuarios, count);
                        }
                        db.close();
                    });
                });
            }
        });
    },
    /**
     * Función que me permite obtener las invitaciones de la base de datos
     * @param criterio por el que queremos buscar
     * @param funcionCallback
     */
    obtenerInvitaciones : function(criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.find(criterio).toArray(function (err, invitaciones) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(invitaciones);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Función que me permite obtener las invitaciones de la aplicación paginadas
     * @param criterio por el que queremos buscar
     * @param pg número de páginas
     * @param funcionCallback
     */
    obtenerInvitacionessPg: function (criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5).toArray(function (err, invitaciones) {
                        if (err) {
                            funcionCallback(null);
                        } else {
                            funcionCallback(invitaciones, count);
                        }
                        db.close();
                    });
                });
            }
        });
    },
    /**
     * Función que permite insertar invitaciones en base de datos
     * @param invitacion invitacion que queremos insertar
     * @param funcionCallback
     */
    insertarInvitacion : function(invitacion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.insertOne(invitacion, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Modifica el usuario indicado por el criterio
     * @param criterio, criterio a seguir para buscar el usuario
     * @param usuario, usuario con nuevos datos
     * @param funcionCallback
     */
    modificarUsuario : function(criterio, usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.update(criterio, {$set: usuario}, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Añade un usuario a la lista de amigos
     * @param criterio 
     * @param amigo
     * @param funcionCallback
     */
    añadirAAmigos(criterio, amigo, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.update(criterio, {$push: { "amigos" : amigo }}, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Elimina la invitación indicada por el criterio
     * @param criterio, criterio a seguir
     * @param funcionCallback
     */
    eliminarInvitacion : function(criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.remove(criterio, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Inserta un mensaje
     * @param mensaje mensaje que queremos insertar
     * @param funcionCallback
     */
    insertarMensaje : function(mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('mensajes');
                collection.insertOne(mensaje, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Permite obtener los mensajes según criterio pasado como parámetro
     * @param criterio criterio para obtener los datos
     * @param funcionCallback
     */
    obtenerMensajes(criterio, funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('mensajes');
                collection.find(criterio).toArray(function (err, mensajes) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(mensajes);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Actualiza todos los mensajes que cumplan el criterio especificiado
     * @param criterio, criterio a seguir
     * @param cambio, cambio que se realiza
     * @param funcionCallback
     */
    modificarMensaje : function(criterio, cambio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('mensajes');
                collection.updateMany(criterio, { $set: cambio }, function(err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    /**
     * Permite resetear la base de datos eliminando todas las colecciones
     * @param funcionCallback
     */
    resetear : function(funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let coleccion = db.collection('invitaciones');
                coleccion.remove({}, function(result) {
                    coleccion = db.collection('usuarios');
                    coleccion.remove({}, function(result) {
                        coleccion =db.collection('mensajes');
                        coleccion.remove({}, function(result) {
                            funcionCallback(result);
                        });
                    });
                });
            }
        });
    },
    /**
     * Permite insertar varios datos en la colección pasada como parametro
     * @param coleccion colección donde queremos insertar los datos
     * @param datos datos que queremos insertar
     * @param funcionCallback
     */
    insertarVarios : function(coleccion, datos, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(coleccion);
                collection.insertMany(datos, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    }
};
