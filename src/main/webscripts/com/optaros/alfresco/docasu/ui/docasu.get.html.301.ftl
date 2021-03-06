<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8">
		<title>
			DoCASU - Redirect...
		</title>
		<script defer="defer" type="text/javascript" charset="utf-8">
			function doRedirectToUrl(url) {
				setTimeout(function(){window.location = url;}, 2000);
			}
		</script>
	</head>
	<body id="" onload="doRedirectToUrl('${redirectUrl}')">
		<p>The DoCASU's location has moved - you'll be redirected in a couple of seconds... </p>
		<p>Please update your bookmark with the new location: <a href="${absurl(redirectUrl)}">${absurl(redirectUrl)}</a></p>
	</body>
</html>
