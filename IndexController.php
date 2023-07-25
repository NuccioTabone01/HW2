<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class IndexController extends Controller
{
    
    public function search(Request $request)
    {
        $tipo = $request->input('tipo');
        $chap = $request->input('chap');
    
        $url = "https://api.scripture.api.bible/v1/bibles/41f25b97f468e10b-01/passages/" . $tipo . "." . $chap . "?content-type=json&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false";
    
        $headers = array(
            "accept: application/json",
            "api-key: 76ba17ccdb439da7f6d049db05e9bf18"
        );
    
        $curl = curl_init($url);
    
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    
        $response = curl_exec($curl);
    
        if ($response === false) {
            $error = curl_error($curl);
            echo "Errore nella richiesta: " . $error;
        }
    
        curl_close($curl);
    
        echo $response;
    }


    public function search_word(Request $request)
    {
        $object = $request->input('object');
        $url = "https://api.scripture.api.bible/v1/bibles/41f25b97f468e10b-01/search?query=" . $object . "&sort=relevance&fuzziness=AUTO";
    
        $headers = array(
            "accept: application/json",
            "api-key: 76ba17ccdb439da7f6d049db05e9bf18"
        );
    
        $curl = curl_init($url);
    
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    
        $response = curl_exec($curl);
    
        if ($response === false) {
            $error = curl_error($curl);
            echo "Errore nella richiesta: " . $error;
        }
    
        curl_close($curl);
    
        echo $response;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
