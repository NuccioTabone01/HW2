<?php
namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\post;
use App\Models\FollowedUser;

class HomeController extends BaseController
{
    public function home()
    {
        $userId = Session::get('user_id');
        if (!$userId) {
            return redirect('login');
        }
        $user = User::find($userId);
        $users = User::where('id', '!=', $user->id)->get();

        if (!$user) {
            return redirect('login');
        }

        $followedUserIds = DB::table('followed_users')
        ->where('follower_id', $userId)
        ->pluck('followed_id')
        ->toArray();
        
        
        
        return view('home', compact('user', 'users', 'followedUserIds'));    
    }



    public function profile(){

    $userId = Session::get('user_id');
        if (!$userId) {
            return redirect('login');
        }
    
        $user = User::find($userId);
    
        if (!$user) {
            Session::flush();
            return redirect('login');
        }
    
        return view('profilo')->with('user', $user);
    }

    public function personal_posts(){

    if(!Session::has('user_id')){
        return redirect('login');
    }
    
    $userid = Session::get('user_id');
    $conn = DB::connection();

    if (!$conn) {
    die("Errore di connessione al database: " . mysqli_connect_error());
    }

    $posts = array();

    $user = User::find($userid);
    if ($user) {
        $username = $user->username;
    }

    $posts = Post::where('username', $username)->orderBy('time')->get();
    

    return response()->json($posts);


    }



    public function salva_commento(Request $request)
    {
    if (!Session::has('user_id')) {
        return redirect('login');
    }

    $userid = Session::get('user_id');

    $user = User::find($userid);

    if (!$user) {
        return "Accesso negato. Non sei autenticato.";
    }

    $username = $user->username;

    if ($request->has('comment')) {
        $content = $request->input('comment');

        $post = new Post();
        $post->username = $username;
        $post->commentText = $content;
        $post->nlikes = 0;
        $post->time = now();
        $post->save();

        return response()->json(['message' => 'Post salvato con successo.']);
    }

    return response()->json(['error' => 'Parametri mancanti'], 400);
    }


    public function carica_post()
    {
        if(!Session::has('user_id')){
        return redirect('login');
        }
        $userid = Session::get('user_id');

         $followedUserIds = DB::table('followed_users')
         ->where('follower_id', $userid)
         ->pluck('followed_id')
         ->toArray();
         $followedUserIds[] = $userid;
        $followedUsers = User::whereIn('id', $followedUserIds)->pluck('username')->toArray();


        $posts = DB::table('posts')->whereIn('username', $followedUsers)->orderBy('time')->get();

        $likedPostsIds = DB::table('liked_posts')->where('user', $userid)->pluck('post_id')->toArray();
    
        foreach ($posts as $post) {
         $post->liked = in_array($post->id, $likedPostsIds);
        }
    
        return response()->json($posts);

    }


    public function like_post(Request $request)
    {

    if(!Session::has('user_id')){
        return redirect('login');
    }
        
    $userid = Session::get('user_id');
        
    if (!$userid) {
        return response()->json(['ok' => false, 'error' => 'Errore di autenticazione.']);
    }
    
    $postid = $request->input('postId');
        
    DB::table('liked_posts')->insert([
        'user' => $userid,
        'post_id' => $postid,
    ]);

    
    $nlikes = DB::table('posts')->where('id', $postid)->value('nlikes');
    return response()->json(['ok' => true, 'nlikes' => $nlikes]);
    
    }

    

    public function follow_user(Request $request)
    {
        $userId = $request->input('user_id');
        $currentUserid =Session::get('user_id');
    
        $isFollowing = FollowedUser::where('follower_id', $currentUserid)
            ->where('followed_id', $userId)
            ->exists();
    
        if ($isFollowing) {
            FollowedUser::where('follower_id', $currentUserid)
                ->where('followed_id', $userId)
                ->delete();
        } else {
            FollowedUser::create([
                'follower_id' => $currentUserid,
                'followed_id' => $userId,
            ]);
        }
    
        return redirect()->back(); 
    }

    


    public function unlike_post(Request $request)
    {
    if (!Session::has('user_id')) {
        return redirect('login');
    }

    $userid = Session::get('user_id');
    if (!$userid) {
        return response()->json(['ok' => false, 'error' => 'Errore di autenticazione.']);
    }
    $postid = $request->input('postId');
    if (!$postid) {
        return response()->json(['ok' => false, 'error' => 'Errore di autenticazione.']);
    }

    DB::table('liked_posts')
    ->where('user', $userid)
    ->where('post_id', $postid)
    ->delete();

    $nlikes = DB::table('posts')->where('id', $postid)->value('nlikes');
    return response()->json(['ok' => true, 'nlikes' => $nlikes]);
    }

}