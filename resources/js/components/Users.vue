<template>
    <div>
        <div class="row mt-5">  
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title heading">Users Table</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" data-toggle="modal" data-target="#addUser">Add User <i class="fas fa-user-plus"></i> </button>
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
                                    <a href="#">
                                        <i class="fas fa-edit blue"></i>
                                    </a>
                                    <a href="#">
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
                    <h5 class="modal-title" id="userAddLabel">Create User</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form @submit.prevent="createUser">
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
                            <input id="password" v-model="form.password" type="password" name="password" class="form-control">
                            <HasError :form="form" field="password" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "CreateUser",
        data() {
            return {
                users: {},
                form: new Form({
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
            loadUsers() {
                this.$Progress.start()
                axios.get("/api/users")
                .then( resp => {
                    // console.log(resp.data.users.data)
                    this.users = resp.data.users.data;
                    this.$Progress.finish();
                })
            },
            createUser() {
                this.$Progress.start();

                this.form.post('/api/users')
                .then( resp => {

                    Fire.$emit('afterCreated'); // send custom event, component communication

                    $('#addUser').modal('hide');

                    Toast.fire({
                        icon: 'success',
                        title: 'User created successfully'
                    });
                    this.$Progress.finish();
                });
            }
        },
        created() {
            this.loadUsers();
            Fire.$on('afterCreated', () => this.loadUsers()); // catch custom event, component communication
            // is not good for performance reason only for test use
            // setInterval(() => this.loadUsers() , 3000);
        }
    }
</script>
