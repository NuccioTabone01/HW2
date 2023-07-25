<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;
use App\Models\User;

class LoginController extends BaseController
{
    public function login()
    {
        return view('login');
    }
    
    public function torna_home()
    {
        return view('index');
    }



    public function do_login()
    {
        if (Session::has('user_id')) {
            return redirect('home');
        }
    
        $error = array();
        if (!empty(Request::input('username')) && !empty(Request::input('password'))) {
            $user = User::where('username', Request::input('username'))->first();
    
            if (!$user) {
                $error['username'] = "Username non trovato";
            } else {
                if (!password_verify(Request::input('password'), $user->password)) {
                    $error['password'] = "Password errata";
                }
            }
    
            if (count($error) == 0) {
                if ($user && $user->id) {
                    Session::put('user_id', $user->id);
                    return redirect('home');
                } else {
                    $error['username'] = "ID utente non valido";
                }
            }
        } else {
            $error['username'] = "Inserisci username e password";
        }
    
        return redirect('login')->withInput()->withErrors($error);
    }
    
    
    public function signup()
    {
        return view('signup');
    }

    public function check($field)
    {
        if(empty(Request::get('q'))) {
            return ['exists' => false];
        }
        $user = User::where($field, Request::get('q'))->first();
        return ['exists' => $user ? true : false];
    }

    public function do_signup()
    {
        if(Session::has('user_id')) {
            return redirect('home');
        }   
        
        $error = array();
    
        if (!empty(Request::get("username")) && !empty(Request::get("password")) && !empty(Request::get('email')) && !empty(Request::get('name')) && 
            !empty(Request::get('surname')) && !empty(Request::get('confirm_password')))
        {
            
            if(!preg_match('/^[a-zA-Z0-9_]{1,15}$/', $_POST['username'])) {
                $error['username'] = "Username non valido";
            } else {
                if(User::where('username', Request::get('username'))->first())
                {
                    dd(User::where('username', Request::get('username'))->first());
                    $error['username'] = "Username già utilizzato";
                }
            }
            if (strlen(Request::get("password")) < 8) {
                $error['password'] = "Caratteri password insufficienti";
            } 
            if (Request::get('password') != Request::get('confirm_password')) {
                $error['password'] = "Le password non coincidono";
            }
            if (!filter_var(Request::get('email'), FILTER_VALIDATE_EMAIL)) {
                $error['email'] = "Email non valida";
            } else {
                if(User::where('email', Request::get('email'))->first())
                {
                    $error['email'] = "Email già utilizzata";
                }
            }


            if (count($error) == 0) {
                $password = password_hash(Request::get('password'), PASSWORD_BCRYPT);
    
                $user = new User;
                $user->username = Request::get('username');
                $user->password = $password;
                $user->name = Request::get('name');
                $user->surname = Request::get('surname');
                $user->email = Request::get('email');
                $user->save();
                Session::put('user_id', $user->id);
                return redirect('home')->with('user', $user);
            }

        }
        else {
            $error[] = "Compila tutti i campi";
        }
        return redirect('signup')->withInput()->withErrors($error);
    }



}
