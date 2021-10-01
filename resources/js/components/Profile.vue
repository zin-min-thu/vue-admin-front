<template>
  <div class="row justigy-content-center">
    <!-- Widget: user widget style 1 -->
    <div class="col-md-12">
      <div class="card card-widget widget-user mt-5">
        <!-- Add the bg color to the header using any of the bg-* classes -->
        <div
          class="widget-user-header text-white"
          style="background: url('img/background-cover.png') center center"
        >
          <h3 class="widget-user-username text-right">Elizabeth Pierce</h3>
          <h5 class="widget-user-desc text-right">Web Designer</h5>
        </div>
        <div class="widget-user-image">
          <img
            class="img-circle"
            :src="getProfilePhoto()"
            alt="User Profile"
          />
        </div>
        <div class="card-footer">
          <div class="row">
            <div class="col-sm-4 border-right">
              <div class="description-block">
                <h5 class="description-header">3,200</h5>
                <span class="description-text">SALES</span>
              </div>
              <!-- /.description-block -->
            </div>
            <!-- /.col -->
            <div class="col-sm-4 border-right">
              <div class="description-block">
                <h5 class="description-header">13,000</h5>
                <span class="description-text">FOLLOWERS</span>
              </div>
              <!-- /.description-block -->
            </div>
            <!-- /.col -->
            <div class="col-sm-4">
              <div class="description-block">
                <h5 class="description-header">35</h5>
                <span class="description-text">PRODUCTS</span>
              </div>
              <!-- /.description-block -->
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->
        </div>
      </div>
    </div>
    <!-- /.widget-user -->

    <div class="col-md-12">
      <div class="card">
        <div class="card-header p-2">
          <ul class="nav nav-pills">
            <li class="nav-item">
              <a class="nav-link active" href="#activity" data-toggle="tab"
                >Activity</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#settings" data-toggle="tab"
                >Settings</a
              >
            </li>
          </ul>
        </div>
        <!-- /.card-header -->
        <div class="card-body">
          <div class="tab-content">
            <div class="tab-pane active" id="activity">
              <h1>Displey User activity</h1>
            </div>

            <div class="tab-pane" id="settings">
              <AlertError :form="form" />
              <form class="form-horizontal">
                <div class="form-group row">
                  <label for="inputName"  class="col-sm-2 col-form-label"
                    >Name</label
                  >
                  <div class="col-sm-10">
                    <input
                      type="text"
                      v-model="form.name"
                      class="form-control"
                      id="name"
                      name="name"
                      placeholder="Name"
                      :class="{ 'is-invalid': form.errors.has('name') }"
                    />
                    <has-error :form="form" field="name"></has-error>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputEmail" class="col-sm-2 col-form-label"
                    >Email</label
                  >
                  <div class="col-sm-10">
                    <input
                      type="email"
                      class="form-control"
                      v-model="form.email"
                      name="email"
                      id="inputEmail"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputExperience" class="col-sm-2 col-form-label"
                    >Experience</label
                  >
                  <div class="col-sm-10">
                    <textarea
                      v-model="form.bio"
                      name="bio"
                      class="form-control"
                      id="inputExperience"
                      placeholder="Experience"
                    ></textarea>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputSkills" class="col-sm-2 col-form-label"
                    >Profile Photo</label
                  >
                  <div class="col-sm-10">
                    <input
                      type="file"
                      class="form-control"
                      id="photo"
                      @change="uploadImage"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputExperience" class="col-sm-2 col-form-label"
                    >Password (leave empty if not changing)</label
                  >
                  <div class="col-sm-10">
                    <input v-model="form.password" type="password" name="password" id="password" class="form-control">
                  </div>
                </div>
                <div class="form-group row">
                  <div class="offset-sm-2 col-sm-10">
                    <button @click.prevent="updateProfile" type="submit" class="btn btn-success">Update</button>
                  </div>
                </div>
              </form>
            </div>
            <!-- /.tab-pane -->
          </div>
          <!-- /.tab-content -->
        </div>
        <!-- /.card-body -->
      </div>
    </div>
    <!-- /.card -->
  </div>
</template>

<script>
export default {
    data() {
        return {
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
      loadProfile() {
        axios.get('/api/profile')
        .then( resp => {
            this.form.fill(resp.data.user);
        })
        .catch( e => {
            console.log(e)
        })
      },
      getProfilePhoto() {
        let photo = ( this.form.photo.length > 200) ? this.form.photo : "img/profile/"+this.form.photo;
        return photo;
      },
      updateProfile() {
        this.$Progress.start();

        if(this.form.password == '') {
          this.form.password = undefined;
        }

        this.form.put('/api/profile')
          .then( resp => {
            Fire.$emit('afterAction');
            
            Toast.fire({
              icon: 'success',
              tilte: resp.data.messsage
            });

            this.$Progress.finish();
          })
          .catch( e => {
            this.$Progress.fail();
          })
      },
      uploadImage( e ) {
        let file = e.target.files[0];
        console.log(file);

        let reader = new FileReader();

        if( file['size'] < 2111775) {
          reader.onloadend = ( file ) =>  {
            this.form.photo = reader.result;
            // console.log('Result', reader.result)
          }

          // console.log("Uploading profile")
          reader.readAsDataURL(file)
        } else {

        }
        
      }
    },
    created() {
        this.form.clear();

        this.loadProfile();

        Fire.$on('afterAction', () => this.loadProfile());
    },
    mounted() {
        console.log("Component mounted.");
    },
};
</script>
<style>
</style>
