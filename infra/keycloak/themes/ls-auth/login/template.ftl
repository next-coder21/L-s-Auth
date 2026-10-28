<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false>
<!DOCTYPE html>
<html lang="${lang!'en'}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Sign in with L's Auth - Single Sign-On</title>
    <link rel="icon" href="${url.resourcesPath}/img/ls-auth-logo.png" />
    <link rel="stylesheet" href="${url.resourcesPath}/css/ls-auth-kc.css" />
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
</head>

<body>
    <div class="sso-viewport">
        <!-- Ambient background glows -->
        <div class="glow-orb glow-orb-1"></div>
        <div class="glow-orb glow-orb-2"></div>

        <div class="sso-container">
            <div class="sso-card">
                
                <!-- Brand Header -->
                <div class="sso-header">
                    <div class="brand-row">
                        <img src="${url.resourcesPath}/img/ls-auth-logo.png" alt="L's Auth Logo" class="brand-logo" />
                        <div class="brand-text">
                            <span class="brand-name">L's <span class="brand-accent">Auth</span></span>
                            <span class="brand-sub">Identity &amp; Access Management</span>
                        </div>
                    </div>

                    <h1 class="sso-title">Sign in with L's Auth</h1>

                    <!-- Target Client Application (Google SSO style) -->
                    <div class="app-destination">
                        <span class="app-dest-label">to continue to</span>
                        <div class="app-chip">
                            <span class="app-chip-icon">
                                <#if (client.name!'')?has_content>
                                    ${client.name?substring(0, 1)?upper_case}
                                <#else>
                                    A
                                </#if>
                            </span>
                            <span class="app-chip-name">${(client.name)!(client.clientId)!'Enterprise Application'}</span>
                        </div>
                    </div>
                </div>

                <!-- Feedback Alert (Errors / Warnings) -->
                <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppApproved??)>
                    <div class="alert alert-${message.type}">
                        <div class="alert-icon">
                            <#if message.type = 'success'>
                                &#10003;
                            <#elseif message.type = 'warning'>
                                &#9888;
                            <#elseif message.type = 'error'>
                                &#9888;
                            <#else>
                                &#8505;
                            </#if>
                        </div>
                        <div class="alert-text">${kcSanitize(message.summary)?no_esc}</div>
                    </div>
                </#if>

                <!-- Main Form Body -->
                <div class="sso-body">
                    <#nested "form">
                </div>

                <!-- Test accounts helper -->
                <div class="sso-helper">
                    <span class="helper-label">Quick Fill:</span>
                    <button type="button" class="helper-btn" onclick="fillCreds('admin', 'Admin@123')">Admin (Admin@123)</button>
                    <button type="button" class="helper-btn" onclick="fillCreds('developer', 'Dev@123')">Developer (Dev@123)</button>
                </div>

            </div>

            <!-- SSO Card Footer -->
            <div class="sso-footer">
                <div class="footer-copy">
                    &copy; 2026 Liji Groups &bull; Secured with L's Auth
                </div>
                <div class="footer-links">
                    <a href="http://localhost:3000/privacy" target="_blank">Privacy</a>
                    <a href="http://localhost:3000/terms" target="_blank">Terms</a>
                    <a href="mailto:support@lijigroups.com">Help</a>
                </div>
            </div>

        </div>
    </div>

    <script>
        function fillCreds(u, p) {
            var uInput = document.getElementById('username');
            var pInput = document.getElementById('password');
            if (uInput) { uInput.value = u; }
            if (pInput) { pInput.value = p; }
            var err = document.querySelector('.alert-error');
            if (err) { err.style.display = 'none'; }
        }

        function togglePassword() {
            var pInput = document.getElementById('password');
            var eyeBtn = document.getElementById('toggle-password-btn');
            if (pInput) {
                if (pInput.type === 'password') {
                    pInput.type = 'text';
                    if (eyeBtn) eyeBtn.innerText = 'Hide';
                } else {
                    pInput.type = 'password';
                    if (eyeBtn) eyeBtn.innerText = 'Show';
                }
            }
        }
    </script>
</body>
</html>
</#macro>

