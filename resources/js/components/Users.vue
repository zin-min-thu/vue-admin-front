<template>
    <div>
        <div class="row mt-5" v-if="$gate.isAdmin()">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title heading">Users Table</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" @click="newModal">Add User <i class="fas fa-user-plus"></i> </button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover text-nowrap">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Eamil</th>
                                <th>Type</th>
                                <th>Register At</th>
                                <th>Modify</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{ user.id }}</td>
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.type | upText }}</td>
                                <td>{{ user.created_at | newDate }}</td>
                                <td>
                                    <a href="#" @click="editModal( user )">
                                        <i class="fas fa-edit blue"></i>
                                    </a> | 
                                    <a href="#" @click="deleteUser(user.id)">
                                        <i class="fas fa-trash red">
                                        </i>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
            <!-- /.card -->
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addUser" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="userAddLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userAddLabel">{{ editmode ? 'Update User' : 'Create User'}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form @submit.prevent="editmode ? updateUser() : createUser()">
                    <div class="modal-body">
                        <AlertError :form="form" />
                        <!-- <AlertErrors :form="form" /> -->
                        <!-- <AlertSuccess :form="form" message="Your changes have beend saved!" /> -->

                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input id="name" v-model="form.name" type="text" name="name" class="form-control" placeholder="Name" :class="{ 'is-invalid' : form.errors.has('name')}">
                            <HasError :form="form" field="name" />
                        </div>

                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input id="email" v-model="form.email" type="email" name="email" class="form-control" placeholder="Email" :class="{ 'is-invalid' : form.errors.has('email')}">
                            <HasError :form="form" field="email" />
                        </div>

                        <div class="mb-3">
                            <label for="bio" class="form-label">Bio</label>
                            <textarea name="bio" id="bio" v-model="form.bio" class="form-control"  :class="{ 'is-invalid' : form.errors.has('bio')}">
                            </textarea>
                            <HasError :form="form" field="bio" />
                        </div>

                        <div class="mb-">
                            <label for="type">Type</label>
                            <select name="type" id="type" v-model="form.type" class="form-control" :class="{ 'is-invalid' : form.errors.has('type')}">
                                <option value="">Select User Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">Standard User</option>
                                <option value="author">Author</option>
                            </select>
                            <HasError :form="form" field="type"></HasError>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input id="password" v-model="form.password" type="password" name="password" class="form-control" :class="{ 'is-invalid' : form.errors.has('type')}">
                            <HasError :form="form" field="password" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">{{ editmode ? 'Update' : "Save" }}</button>
                    </div>
                </form>
            </div>
        </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "User",
        data() {
            return {
                editmode: false,
                users: {},
                form: new Form({
                    id: '',
                    name:'',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo:''
                })
            }
        },
        methods: {
            newModal() {
                this.editmode = false;
                this.form.reset();
                $('#addUser').modal('show');
            },
            editModal( user ) {
                this.editmode = true;
                // this.form.reset();
                this.form.clear();
                $('#addUser').modal('show');
                this.form.fill(user);
            },
            loadUsers() {
                this.$Progress.start()
                if(this.$gate.isAdmin) {
                    axios.get("/api/users")
                    .then( resp => {
                        // console.log(resp.data.users.data)
                        this.users = resp.data.users.data;
                        this.$Progress.finish();
                    })
                    .catch( e => {
                        console.log(e);
                        this.$Progress.fail();
                    });
                }
            },
            createUser() {
                this.$Progress.start();

                this.form.post('/api/users')
                .then( resp => {

                    Fire.$emit('afterAction'); // send custom event, component communication

                    $('#addUser').modal('hide');

                    Toast.fire({
                        icon: 'success',
                        title: 'User created successfully'
                    });
                    this.$Progress.finish();
                })
                .catch( e => {
                    console.log(e);
                    this.$Progress.fail();
                });
            },
            updateUser() {
                this.$Progress.start();
                this.form.put('/api/users/'+ this.form.id)
                .then( resp => {

                    $('#addUser').modal('hide');

                    Fire.$emit('afterAction'); // send custom event, component communication

                    Toast.fire({
                        icon: 'success',
                        title: resp.data.message
                    });
                    this.$Progress.finish();
                })
                .catch( e => {
                    console.log(e);
                    this.$Progress.fail();
                });
            },
            deleteUser(id) {
                Swal.fire({
                    title: 'Are you sure?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Delete!'
                    }).then((result) => {
                    if (result.isConfirmed) {

                        this.form.delete('/api/users/'+id)
                        .then( resp => {
                            console.log(resp.data.message);
                            Swal.fire(
                                'Deleted!',
                                resp.data.message,
                                'success'
                            );
                            Fire.$emit('afterAction');
                        })
                        .catch( e => {
                            console.log(e);
                            this.$Progress.fail();
                        })
                        
                    }
                })
            }
        },
        created() {
            this.loadUsers();
            Fire.$on('afterAction', () => this.loadUsers()); // catch custom event, component communication
            // is not good for performance reason only for test use
            // setInterval(() => this.loadUsers() , 3000);
        }
    }
</script>
