<?php

namespace App\Http\Controllers\API;

use Image;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    public function index()
    {
        $this->authorize('isAdmin');

        $users = User::latest()->paginate(10);

        return response()->json(['users'=>$users]);
        // return $users;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|string|email|max:191|unique:users',
            'password' => 'required|string|min:6'
        ]);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'type' => $request->type,
            'bio' => $request->bio,
            'photo' => $request->photo,
            'password' => Hash::make($request->password)
        ]);

        return response()->json(['message' => 'User Created successfully', 'user' => $user->name]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
    }

    public function profile()
    {
        return response()->json(['user' => auth('api')->user()]);
    }

    public function updateProfile( Request $request )
    {
        $user = auth('api')->user();

        $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|string|email|max:191|unique:users,email,'.$user->id,
            'password' => 'sometimes|required|min:6'
        ]);

        $current_photo = $user->photo;
        if( $request->photo != $current_photo ) {
            // $name = time().'.'. explode('/', explode(':', substr($request->photo, 0, strops($request->photo, ';')))[1])[1];
            $name = time().'.' . explode('/', explode(':', substr($request->photo, 0, strpos($request->photo, ';')))[1])[1];
            
            Image::make($request->photo)->save(public_path('img/profile/').$name);
            // $request->photo = $name;
            $request->merge(['photo' => $name]);
        
            $old_photo = public_path('img/profile/').$current_photo;
            if(file_exists($old_photo)) {
                @unlink($old_photo);
            }

        }

        if(!empty($request->password)) {
            $request->merge(['password' => Hash::make($request->password)]);
        }

        // return $request->all();
        $user->update($request->all());

        return response()->json(['message' => "Profile updated successfully."]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // if(!Gate::allows('isAdmin')) {
        //     return response()->json(['message' => 'You have no permission for this page']);
        // }
        $this->authorize('isAdmin');

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|string|email|max:191|unique:users,email,'.$user->id,
            'password' => 'sometimes|min:6'
        ]);
        
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'type' => $request->type,
            'bio' => $request->bio,
            'photo' => $request->photo,
            'password' => Hash::make($request->password)
        ]);

        return response()->json(['message' => 'User Updated successfully', 'user' => $user->name]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        return response()->json(['message' => 'User has been deleted.']);
    }
}
