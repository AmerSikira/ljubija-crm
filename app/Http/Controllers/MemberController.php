<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    //

    public function index() {

        $members = Member::all();
        return Inertia::render('members/index', ['members' => $members]);
    }

    public function create() {
        return Inertia::render('members/create');
    }

    public function store(Request $request) {
        dd($request->all());
    }
}
