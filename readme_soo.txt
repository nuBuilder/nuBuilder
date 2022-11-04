SSO (Single Sign On) for nuBuilder Forte

Note:  This is only a *starting point* for documentation.  I am not exactly sure where this information should "live", e.g. in the nuBuilder manual, on the Wiki page, etc.  The intention is not to add this SSO_README.txt in the root folder, it is just a placeholder.

How to set up SSO for nuBuilder:-

1. Get the Python Quickstart working by following the instructions from Microsoft here:-
https://learn.microsoft.com/en-us/azure/active-directory/develop/web-app-quickstart?pivots=devlang-python
Note:  The nuBuilder team does not support this.
If you need help with this, please look for help on the Microsoft pages/forums etc.
If your organization uses Azure SSO and your goal is to integrate organizational sign on using that, you will also need to ask your IT department to register your application.

2. The app.py file from the Quickstart needs to exist in the wsgi_sso directory in the nuBuilder code, under your web server's "DocumentRoot".
"DocumentRoot" is an Apache configuration item.  In Nginx, this configuration item is called "root".
You may have renamed "nuBuilder4.5" already, in which case "DocumentRoot" refers to the directory formerly named "nuBuilder4.5".
"DocumentRoot" is the directory containing your nuconfig.php (and/or the template file nuconfig-sample.php in the original distribution).
You will find 'nuSsoDbFunctions.py' in the wsgi_sso directory.
You will also find 'sso.wsgi' and 'templates/js_post.html' in that directory, from the nuBuilder source.
There should not be any filename collisions between the nuBuilder source and the Quickstart, so it should be unsafe to unpack Quickstart into the wsgi_sso directory.

3. If you run app.py from step 1 "standalone" by invoking: 
python app.py
(or python3 app.py)
It will run a built-in micro web server on port 5000.
You should be able to visit http://localhost:5000/login in a browser on the same machine.
Then click the log in link, log in with your SSO credentials if you are prompted to do so.
You should then see "Welcome <your name>!" (in the browser).
You should also be able to visit http://localhost:5000/logout, then logout of your SSO account and repeat the above successfully.

Important: Do not proceed to the next step until this is fully working.

4. Apache mod_wsgi build and installation

Note:  The nuBuilder team does not support this.
If you need help with this, you will need to search the web (e.g. Stack Overflow pages).
For example:  https://stackoverflow.com/a/59801388/13781581

WINDOWS
4a. Windows Visual Studio IDE installation.
I found that I had to install the Visual Studio IDE in order to complete this step.
I downloaded from:
https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2017 and used the "Still not sure which tool is best for you? We can help" part to select C++ and Windows and Community Edition.
After installing, I created a new C++ project and ran the Hello World Windows console program (which is linked to in the above Stack Overflow answer), before the subsequent steps below worked.

4b.  Install mod-wsgi by runnign the following comannd: "pip3 install mod-wsgi".  The result should look like this:-

	Collecting mod-wsgi
	  Using cached mod_wsgi-4.9.4.tar.gz (497 kB)
	  Preparing metadata (setup.py) ... done
	Using legacy 'setup.py install' for mod-wsgi, since package 'wheel' is not installed.
	Installing collected packages: mod-wsgi
	  Running setup.py install for mod-wsgi ... done
	Successfully installed mod-wsgi-4.9.4

4c.  To get the correct Apache configuration text, run the following command:  "mod_wsgi-express module-config".
Initially I had the following error:
-> ERROR:  File "C:\Users\myUserID\AppData\Local\Programs\Python\Python310\lib\site-packages\mod_wsgi\server\apxs_config.py", line 15
    BINDIR = 'C:\xampp\apache/bin'

To fix this, I changed the following two lines in apxs_config.py to use forward slashes:-
BINDIR = 'C:/xampp/apache/bin'
LIBEXECDIR = 'C:/xampp/apache/modules'

When I re-ran "mod_wsgi-express module-config", the result was:-

LoadFile "C:/Users/myUserID/AppData/Local/Programs/Python/Python310/python310.dll"
LoadModule wsgi_module "C:/Users/myUserID/AppData/Local/Programs/Python/Python310/lib/site-packages/mod_wsgi/server/mod_wsgi.cp310-win_amd64.pyd"
WSGIPythonHome "C:/Users/myUserID/AppData/Local/Programs/Python/Python310"

Do not copy the three lines above!
Run "mod_wsgi-express module-config" and, once it runs without errors, use the (three?) lines of output that it gives you.

4d.  Deploy the orrect Apache configuration text from the above step.

Copy the three lines above into your Apache's httpd.conf, in the section where you see "Dynamic Shared Object (DSO) Support".
There shoud be lots of other "LoadModule" lines, some of which are commented out.
When you restart Apache, mod_wsgi will be loaded. 

4e.  Look at the quickstart Hello World example and make sure that it works before proceeding to the next step.



5. To integrate the Python Quickstart into nuBuilder for SSO, you will need to edit app.py.  Here are the changes:-

5a. At the top, under the line
import app_config
add:-
import nuSsoDbFunctions
standalone = False

5b. In the function that starts with:-
@app.route("/")
def index():
Replace the line
    return render_template('index.html', user=session["user"], version=msal.__version__)
With
    global standalone
    if standalone:
        return render_template('index.html', user=session["user"], version=msal.__version__)
    else:
        code = nuSsoDbFunctions.write_entry_to_sso_login_db_table(str(session["user"]["name"]),
                                                              str(session["user"]["preferred_username"]))
        return render_template("js_post.html", auth_url=session["flow"]["auth_uri"],
                               ssousersname=str(session["user"]["name"]),
                               ssousersemail=str(session["user"]["preferred_username"]),
                               code=code)

5c. In the function that starts with:-
@app.route("/login")
def login():
Replace the line
    return render_template("login.html", auth_url=session["flow"]["auth_uri"], version=msal.__version__)
with
    global standalone
    if standalone:
        return render_template("login.html", auth_url=session["flow"]["auth_uri"], version=msal.__version__)
    else:
        return redirect(session["flow"]["auth_uri"])

5d.  At the bottom of the file, replace the following:-
if __name__ == "__main__":
    app.run()
with
if __name__ == "__main__":
    standalone = True
    app.run()
(i.e. just add the line that says "standalone = True").


6. Apache configuration - skip and go to step 7 if not using Apache as your web server.
The Python Quickstart runs a micro web server on port 5000, but it is not intended for production use.
Here, for production use, we configure Apache to be used instead of the micro web server, and we no longer use port 5000.

Important:  Before you follow the steps below to enable SSO, you must already be sucessfully running nuBuilder without SSO, using Apache as your web server.

6a. The following assumes that your Apache configuration files include the following files (relative to the Apache install root directory):-
conf/httpd.conf
conf/extra/httpd-vhosts.conf
... and also assume that httpd.conf contains a line that includes the httpd-vhosts.conf, as follows:-
Include conf/extra/httpd-vhosts.conf

6b. In conf/httpd.conf you should already have a line that says:-
Listen 80
You can remove this line since we are going to put it in the included file in the next step.

6c. In conf/extra/httpd-vhosts.conf, add the following:-

Listen 80
<VirtualHost *:80>
    DocumentRoot "<DOCUMENT_ROOT>"
    ServerName localhost
    WSGIScriptAlias /sso <DOCUMENT_ROOT>\wsgi_sso/sso.wsgi
    <Directory <DOCUMENT_ROOT>\wsgi_sso>
        Require all granted
    </Directory>
</VirtualHost>

... above:-
<DOCUMENT_ROOT> must be the path to the directory containing your nuconfig.php file.


7. Nginx configuration - skip if not using Nginx as your web server.
If you *are* using Nginx, then apologies, you will have to figure out how to set it up, using the above Apache steps as a reference.
Perhaps you can come back and update these instructions to help other users too?


8. Enable SSO in nuconfig.php (use nuconfig-sample.php for reference) :-
Suggested initial settings :-
	$nuConfigLogonMode = 'both';
	$onlySsoExcept = array('globeadmin');

These settings will show *both* the "SSO Log in" button and the original username/password and "Log in" button *unless* the last user to log in (from the same browser) is not 'globeadmin', in which case only the "SSO Login" button will be shown.

If you want to see *both* login options right after you sign out of your SSO account and your email address for that account is Jon.Doe@example.com then use:-
	$onlySsoExcept = array('globeadmin','Jon.Doe@example.com');

If you want to always show both "SSO Login" and "Login" to all users, you can include "allusers" in the array, for example:-
	$onlySsoExcept = array('globeadmin','allusers');
It is suggested *not* to add a user 'allusers', if you intend to use this option for that user - use another username.

If you want to replace just the nuBuilder logo at the top of the login screen, you can uncomment and modify $nuConfigLoginScreenTopRow starting with the sample code in nuconfig-sample.php.

9. Restart Apache and then point your browser to the usual "index.php" page that you use to access nuBuilder - you should see a green "SSO Log in" button.
If clicking this button does not sign you in, you can look at the Apache error.log file and/or you can press F12 in your browser and then click "Console".
The Apache error.log should give server side clues, and F12 should give client side clues.

10.  For production use, go back to the Quick Start documentation and implement the recommendations.
For example, the app_config.py file says that the CLIENT_SECRET is just a placeholder - for use ONLY during testing, and that, in a production app, a more secure method of storing your secret should be used.
Also verify that you cannot direct a web broswer to fetch and display app_config.py (or nuconfig.php) from the server.

