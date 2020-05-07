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
                    collection.find(criterio).skip((pg - 1) * 4).limit(4).toArray(function (err, usuarios) {
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
    obtenerAmigos: function (criterio, functionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('amigos');
                collection.find(criterio).toArray(function (err, amigos) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(amigos);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerAmigosPg:function (criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('amigos');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 4).limit(4).toArray(function (err, amigos) {
                        if (err) {
                            funcionCallback(null);
                        } else {
                            funcionCallback(amigos, count);
                        }
                        db.close();
                    });
                });
            }
        });

    }
};
