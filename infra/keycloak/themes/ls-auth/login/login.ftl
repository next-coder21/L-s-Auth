<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section = "header">
        Sign in with L's Auth
    <#elseif section = "form">
        <form id="kc-form-login" class="form-container" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
            
            <!-- Email or Username Field -->
            <div class="form-group">
                <label for="username" class="form-label">Email or Username</label>
                <div class="input-wrapper">
                    <span class="input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2"/>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                    </span>
                    <input 
                        tabindex="1" 
                        id="username" 
                        class="form-input" 
                        name="username" 
                        value="${(login.username!'')}" 
                        type="text" 
                        autofocus 
                        autocomplete="username" 
                        placeholder="you@liji.com"
                        aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                    />
                </div>
            </div>

            <!-- Password Field -->
            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <div class="input-wrapper">
                    <span class="input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    </span>
                    <input 
                        tabindex="2" 
                        id="password" 
                        class="form-input" 
                        name="password" 
                        type="password" 
                        autocomplete="current-password" 
                        placeholder="Enter your password"
                        aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                    />
                    <button type="button" id="toggle-password-btn" class="toggle-password" onclick="togglePassword()">
                        Show
                    </button>
                </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="form-actions-row">
                <#if realm.rememberMe && !usernameEditDisabled??>
                    <label class="remember-label">
                        <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" <#if login.rememberMe??>checked</#if> class="remember-checkbox" />
                        <span>Keep me signed in</span>
                    </label>
                <#else>
                    <div></div>
                </#if>

                <#if realm.resetPasswordAllowed>
                    <a tabindex="4" href="${url.loginResetCredentialsUrl}" class="forgot-link">Forgot password?</a>
                </#if>
            </div>

            <!-- Primary Action Button -->
            <button tabindex="5" class="btn-primary" name="login" id="kc-login" type="submit">
                <span>Sign in</span>
                <span class="btn-arrow">&rarr;</span>
            </button>

        </form>
    </#if>
</@layout.registrationLayout>

