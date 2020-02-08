# https://chat.gab.com/dist/js/hydra-app.min.js?v=0.2.81
# Formatted by Dissenter's DevTools Sources tab.

"use strict";
(()=>{
    var e = window.hydra = window.hydra || {};
    e.HydraAdmin = class {
        constructor() {}
        loadUser(t) {
            t.preventDefault();
            var o = t.currentTarget.querySelector('input[id="username"]');
            e.client.resolveUser(o.value).then(e=>{
                if (!e)
                    return window.alert("user not found");
                window.location = `/admin/user/${e._id}`
            }
            ).catch(e=>{
                console.log("loadUser error", e),
                window.alert(e.message)
            }
            )
        }
        askArchiveUser(t) {
            var o = this;
            t.preventDefault();
            var r = JSON.parse(t.currentTarget.getAttribute("data-user"));
            e.client.showModal({
                title: "HYDRA Automated Perma-Ban&trade;",
                prompt: `\n      <p>Are you sure you want to archive user ${r.name} (@${r.username})'?</p>\n      <ul>\n        <li>All of the user's posts will be scrubbed and archived</li>\n        <li>All user permissions will be removed from the user's account</li>\n        <li>The user account will be scrubbed and archived</li>\n        <li>All Content Reports related to the user's posts will be marked dismissed/complete</li>\n        <li>A log of this action will be recorded in the Admin Actions log</li>\n      </ul>`,
                buttons: [{
                    label: "ARCHIVE",
                    class: "btn-danger",
                    onclick: ()=>{
                        window.hydra.client.closeModal(),
                        o.archiveUser(r)
                    }
                }, {
                    label: "CANCEL",
                    onclick: ()=>{
                        window.hydra.client.closeModal()
                    }
                }]
            })
        }
        archiveUser(t) {
            var o = new e.HydraResource;
            e.client.showModal({
                title: "Archiving User...",
                prompt: `Archiving user ${t.name}. Please wait...`
            }),
            o.del(`/admin/user/${t._id}`).then(e=>{
                console.log("archiveUser", e),
                window.location.reload()
            }
            ).catch(e=>{
                console.log("archiveUser error", e)
            }
            )
        }
        loadAuditRecord(e) {
            var t = e.currentTarget.dataset.auditId;
            window.location = `/admin/audit/${t}`
        }
        loadCommentRecord(e) {
            var t = e.currentTarget.dataset.commentId;
            window.location = `/admin/comment/${t}`
        }
        loadAdminGraph(t, o) {
            var r = this;
            (new e.HydraResource).fetch(`/admin/graph/${t}`).then(e=>{
                console.log("admin graph", e),
                r.renderGraph(o, e.response.graph)
            }
            ).catch(e=>{
                console.error("admin graph error", e),
                window.alert("admin graph error: " + (e.message || e.statusText))
            }
            )
        }
        renderGraph(e, t) {
            var o = document.querySelector(e).getContext("2d");
            return new Chart(o,t)
        }
        deleteFeedback(t) {
            t.preventDefault();
            var o = t.currentTarget.getAttribute("data-feedback-id")
              , r = new e.HydraResource
              , a = `/admin/feedback/${o}`;
            return r.del(a).then(()=>{
                var e = document.querySelector(`[data-feedback-id="${o}"].hydra-feedback`);
                e && e.parentNode.removeChild(e)
            }
            ).catch(e=>{
                console.log("delete feedback error", e)
            }
            ),
            !1
        }
        removeContent(e) {
            var t = this;
            e.preventDefault();
            var o = e.currentTarget.getAttribute("data-content-type")
              , r = e.currentTarget.getAttribute("data-content-id");
            return window.hydra.client.showModal({
                title: "Please Confirm",
                prompt: "Are you sure you want to remove the selected content?",
                buttons: [{
                    label: "REMOVE IT",
                    class: "btn-danger",
                    onclick: ()=>{
                        switch (window.hydra.client.closeModal(),
                        o) {
                        case "Comment":
                            t.doRemoveComment(e, r)
                        }
                    }
                }, {
                    label: "CANCEL",
                    class: "btn-secondary",
                    onclick: ()=>{
                        window.hydra.client.closeModal()
                    }
                }]
            }),
            !0
        }
        doRemoveComment(t, o) {
            var r = new e.HydraResource
              , a = document.querySelector(`[data-comment-id="${o}"].comment-body`);
            r.del(`/admin/comment/${o}`).then(e=>{
                window.hydra.client.showModal({
                    title: "Success",
                    prompt: "Comment removed successfully.",
                    buttons: [{
                        label: "OK",
                        class: "btn-outline-primary",
                        onclick: ()=>{
                            a.innerHTML = e.response.newBody,
                            window.hydra.client.closeModal()
                        }
                    }]
                })
            }
            ).catch(e=>{
                console.log("remove comment error", {
                    error: e
                })
            }
            )
        }
        dismissContentReport(e) {
            var t = this;
            e.preventDefault();
            var o = e.currentTarget.getAttribute("data-report-id");
            return window.hydra.client.showModal({
                title: "Please Confirm",
                prompt: "Are you sure you want to dismiss the selected content report?",
                buttons: [{
                    label: "DISMISS IT",
                    class: "btn-danger",
                    onclick: ()=>{
                        window.hydra.client.closeModal(),
                        t.doDismissContentReport(e, o)
                    }
                }, {
                    label: "CANCEL",
                    class: "btn-secondary",
                    onclick: ()=>{
                        window.hydra.client.closeModal()
                    }
                }]
            }),
            !0
        }
        doDismissContentReport(t, o) {
            var r = new e.HydraResource
              , a = document.querySelector(`div[data-report-id="${o}"]`);
            r.del(`/admin/content-report/${o}`).then(()=>{
                a.parentElement.removeChild(a)
            }
            ).catch(e=>{
                console.log("delete comment error", {
                    error: e
                })
            }
            )
        }
        deleteContentReport(t) {
            var o = this
              , r = t.currentTarget.getAttribute("data-report-id");
            e.client.showModal({
                title: "Dismiss content report",
                prompt: "Are you sure you want to dismiss this content report?",
                buttons: [{
                    label: "Cancel",
                    class: "btn-secondary",
                    onclick: ()=>{
                        e.client.closeModal()
                    }
                }, {
                    label: "Dismiss Report",
                    class: "btn-danger",
                    icon: "fa-trash",
                    onclick: ()=>{
                        e.client.closeModal(),
                        fetch(`/admin/content-report/${r}`, {
                            method: "DELETE"
                        }).then(e=>e.json()).then(e=>{
                            o.removeContentReportFromView(r),
                            window.alert(e.message)
                        }
                        ).catch(e=>{
                            console.log("deleteContentReport error", e),
                            window.alert(e.message)
                        }
                        )
                    }
                }]
            })
        }
        deleteContentReportAndMessage(t) {
            var o = this
              , r = t.currentTarget.getAttribute("data-report-id")
              , a = t.currentTarget.getAttribute("data-username");
            e.client.showModal({
                title: "Delete chat message",
                prompt: `Are you sure you want to delete the reported chat message from ${a}?`,
                buttons: [{
                    label: "Cancel",
                    class: "btn-secondary",
                    onclick: ()=>{
                        e.client.closeModal()
                    }
                }, {
                    label: "Delete Message",
                    class: "btn-danger",
                    icon: "fa-trash",
                    onclick: ()=>{
                        e.client.closeModal(),
                        fetch(`/admin/content-report/${r}/message`, {
                            method: "DELETE"
                        }).then(e=>e.json()).then(e=>{
                            o.removeContentReportFromView(r),
                            window.alert(e.message)
                        }
                        ).catch(e=>{
                            console.log("deleteContentReportAndMessage error", e),
                            window.alert(e.message)
                        }
                        )
                    }
                }]
            })
        }
        deleteContentReportAndBan(t) {
            var o = this
              , r = t.currentTarget.getAttribute("data-report-id")
              , a = t.currentTarget.getAttribute("data-username");
            e.client.showModal({
                title: "Ban reported user",
                prompt: `Are you sure you want to ban ${a}? The offending message will also be deleted.`,
                buttons: [{
                    label: "Cancel",
                    class: "btn-secondary",
                    onclick: ()=>{
                        e.client.closeModal()
                    }
                }, {
                    label: "Ban User",
                    class: "btn-danger",
                    icon: "fa-trash",
                    onclick: ()=>{
                        e.client.closeModal(),
                        fetch(`/admin/content-report/${r}/message-with-ban`, {
                            method: "DELETE"
                        }).then(e=>e.json()).then(e=>{
                            o.removeContentReportFromView(r),
                            window.alert(e.message)
                        }
                        ).catch(e=>{
                            console.log("deleteContentReportAndMessage error", e),
                            window.alert(e.message)
                        }
                        )
                    }
                }]
            })
        }
        removeContentReportFromView(e) {
            let t = document.querySelector(`.content-report[data-report-id="${e}"]`);
            t && t.parentElement.removeChild(t)
        }
    }
}
)();
var hydra = window.hydra = window.hydra || {};
!function() {
    hydra.HydraAudio = class {
        constructor() {
            this.sounds = {},
            console.log("HydraAudio initialized")
        }
        load(e) {
            console.log("loading audio", {
                fileName: e
            });
            var t = document.createElement("audio");
            t.setAttribute("data-filename", e),
            t.style.display = "none",
            this.sounds[e] = t;
            var o = document.createElement("source");
            o.setAttribute("src", `/sfx/${e}.mp3`),
            o.setAttribute("type", "audio/mpeg"),
            t.appendChild(o),
            (o = document.createElement("source")).setAttribute("src", `/sfx/${e}.ogg`),
            o.setAttribute("type", "audio/ogg"),
            t.appendChild(o),
            document.body.appendChild(t)
        }
        play(e) {
            let t = this.sounds[e];
            return t ? t.play().catch(e=>{
                console.log("audio playback error", e)
            }
            ) : Promise.reject(new Error(`audio ${e} is not loaded or ready`))
        }
    }
}();
hydra = window.hydra = window.hydra || {};
(()=>{
    hydra.HydraBase64 = class {
        constructor() {
            this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            this.lookup = new Uint8Array(256);
            for (var e = 0; e < this.chars.length; e++)
                this.lookup[this.chars.charCodeAt(e)] = e
        }
        encode(e) {
            let t, o = new Uint8Array(e), r = o.length, a = "";
            for (t = 0; t < r; t += 3)
                a += this.chars[o[t] >> 2],
                a += this.chars[(3 & o[t]) << 4 | o[t + 1] >> 4],
                a += this.chars[(15 & o[t + 1]) << 2 | o[t + 2] >> 6],
                a += this.chars[63 & o[t + 2]];
            return r % 3 == 2 ? a = a.substring(0, a.length - 1) + "=" : r % 3 == 1 && (a = a.substring(0, a.length - 2) + "=="),
            a
        }
        decode(e) {
            let t, o, r, a, s, n = .75 * e.length, i = e.length, l = 0;
            "=" === e[e.length - 1] && (n--,
            "=" === e[e.length - 2] && n--);
            var c = new ArrayBuffer(n)
              , d = new Uint8Array(c);
            for (t = 0; t < i; t += 4)
                o = this.lookup[e.charCodeAt(t)],
                r = this.lookup[e.charCodeAt(t + 1)],
                a = this.lookup[e.charCodeAt(t + 2)],
                s = this.lookup[e.charCodeAt(t + 3)],
                d[l++] = o << 2 | r >> 4,
                d[l++] = (15 & r) << 4 | a >> 2,
                d[l++] = (3 & a) << 6 | 63 & s;
            return c
        }
    }
}
)();
hydra = window.hydra = window.hydra || {};
!function() {
    hydra.HydraChat = class {
        constructor(e, t) {
            var o = this;
            o.roomType = t,
            o.chatRoom = e,
            o.currentUser = hydra.client.getCurrentUser(),
            o.currentChatRoom = e || null,
            o.lastChatContent = null,
            o.isUserScrolling = !1,
            o.localizeMessageTimestamps(),
            console.log("HYDRA chat initialized", {
                room: e
            }),
            o.chatSpace = document.getElementById("chat-space"),
            o.chatSpacePrimary = document.querySelector(".chat-space__primary"),
            o.chatSpacePrimary && o.chatSpacePrimary.addEventListener("click", ()=>{
                o.chatSpace.classList.contains("chat-space--sidebar-open") && o.toggleMenu()
            }
            ),
            o.chatRoomContainer = document.querySelector(".chat-room-container"),
            o.messageInputContainer = document.getElementById("message-input-container"),
            o.attachmentPanel = document.getElementById("message-input-attachment"),
            o.attachmentPreview = document.getElementById("message-input-attachment__img"),
            o.attachmentInput = document.getElementById("attachment-file"),
            o.attachmentInput && o.attachmentInput.addEventListener("change", o.onAttachmentChanged.bind(o)),
            o.chatMessageList = document.getElementById("chat-messages"),
            o.chatMessageList && (o.scrollSentinel = document.getElementById("scroll-sentinel"),
            o.scrollSentinel && (o.scrollSentinelContainer = o.scrollSentinel.parentElement,
            o.scrollSentinelBtn = o.scrollSentinel.querySelector("button"),
            o.isFetchingMessages = !1,
            o.scrollToBottom()),
            window.addEventListener("resize", e=>{
                o.isUserScrolling || o.scrollToBottom(),
                o.checkUserScroll(),
                o.checkScrollSentinel(e)
            }
            ),
            o.chatMessageList.addEventListener("scroll", e=>{
                o.checkUserScroll(),
                o.checkScrollSentinel(e)
            }
            )),
            o.chatInputForm = document.getElementById("chat-input-form"),
            o.chatInput = document.getElementById("chat-input"),
            o.chatInput && (o.chatInput.addEventListener("keydown", o.onChatInputKeyDown.bind(o)),
            o.chatInput.addEventListener("keyup", o.onChatInputKeyUp.bind(o))),
            o.sendMessageButton = document.getElementById("send-message-button"),
            hydra.client && hydra.client.socket && (hydra.client.socket.on("chat", o.onChatMessage.bind(o)),
            hydra.client.socket.on("delete-chat-message", o.onDeleteChatMessage.bind(o)),
            hydra.client.socket.on("join-result", o.onChatRoomJoinResult.bind(o))),
            o.headerContainer = document.getElementById("channel-header"),
            o.menuToggleBtn = document.getElementById("channel-header-menu-btn"),
            o.menuToggleBtn && o.menuToggleBtn.addEventListener("click", o.toggleMenu.bind(o)),
            o.roomFilterInput = document.getElementById("sidebar-header-search__input"),
            o.roomItems = document.querySelectorAll(".room-list-item"),
            o.roomFilterInput && (o.roomFilterInput.addEventListener("keyup", o.filterRooms.bind(o)),
            o.roomFilterInput.value = ""),
            o.blockedUsers = [],
            o.getBlockedUsers()
        }
        isCurrentRoomOwner() {
            return !(!this.chatRoom || !this.chatRoom.owner) && this.chatRoom.owner._id.toString() === this.currentUser._id.toString()
        }
        isCurrentRoomModerator() {
            let e = this;
            return !!e.isCurrentRoomOwner() || !(!e.chatRoom || !Array.isArray(e.chatRoom.moderators)) && -1 !== e.chatRoom.moderators.findIndex(t=>t._id.toString() === e.currentUser._id.toString())
        }
        scrollToBottom() {
            this.chatMessageList && (this.chatMessageList.scrollTop = this.chatMessageList.scrollHeight,
            this.isUserScrolling = !1)
        }
        toggleSettingsDialog(e, t, o) {
            hydra.client.showModal({
                title: "Settings",
                prompt: `\n        <form id='settings-dialog-logout-form' method='POST' action='/user/logout'></form>\n        <form id='settings-dialog-form' method='POST' action='/user/chat-settings'>\n          <div class='form-group'>\n            <label for="theme" class='modal-form-label'>Theme:</label>\n            <select id="theme" name="theme" class="modal-form-select">\n              <option value='hydra-dark' ${"hydra-dark" === t ? "selected" : ""}>Dark</option>\n              <option value='hydra-light' ${"hydra-light" === t ? "selected" : ""}>Light</option>\n              <option value='high-contrast' ${"high-contrast" === t ? "selected" : ""}>High Contrast</option>\n            </select>\n          </div>\n          <div class='form-group'>\n            <label for="fontSize" class='modal-form-label'>Font Size</label>\n            <select id="fontSize" name="fontSize" class="modal-form-select">\n              <option value='small' s${"small" === o ? "selected" : ""}>Small</option>\n              <option value='normal' ${"normal" === o ? "selected" : ""}>Normal</option>\n              <option value='large' ${"large" === o ? "selected" : ""}>Large</option>\n            </select>\n          </div>\n        </form>\n      `,
                buttons: [{
                    label: "Log Out",
                    class: "modal-btn-logout",
                    onclick: ()=>{
                        $("#settings-dialog-logout-form").submit(),
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Update",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        $("#settings-dialog-form").submit(),
                        hydra.client.closeModal()
                    }
                }]
            })
        }
        createNewPrivateMessage() {
            hydra.client.showModal({
                title: "Create new Private Message",
                prompt: "\n        <form id='create-new-dm-form' method='POST' action='/private-message'>\n          <div class='form-group mb-0'>\n            <label for=\"username\" class='modal-form-label'>Username(s):</label>\n            <input id=\"username\" name=\"username\" placeholder='Enter @username to invite' class=\"modal-form-input\"/>\n            <small class='form-text text-muted'>(Enter up to 50 usernames seperated by commas)</small>\n          </div>\n        </form>\n      ",
                buttons: [{
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Create",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        document.querySelector("input#username").value.length ? ($("#create-new-dm-form").submit(),
                        hydra.client.closeModal()) : window.alert("Please enter the username of someone to invite to your new Private Message group.")
                    }
                }]
            })
        }
        createNewRoom(e, t="private") {
            var o;
            switch (t) {
            case "public":
                o = '\n          <form id=\'create-new-room-form\' method=\'POST\' action=\'/chat\'>\n            <input type="hidden" name="roomType" value="public" />\n            <p>You are creating a public Chat Room. Anyone can join and participate in this room if they have the link/URL.</p>\n            <div class=\'form-group\'>\n              <label for="name" class=\'modal-form-label\'>Name:</label>\n              <input id="name" name="name" placeholder=\'Enter room name\' class="modal-form-input"/>\n            </div>\n            <div class=\'form-group mb-0\'>\n              <label for="policy" class=\'modal-form-label\'>Description / Policy:</label>\n              <textarea id="policy" name="policy" placeholder="Enter room policy" rows="4" class="modal-form-textarea"></textarea>\n            </div>\n          </form>\n        ';
                break;
            case "private":
                o = '\n          <form id=\'create-new-room-form\' method=\'POST\' action=\'/chat\'>\n            <input type="hidden" name="roomType" value="private" />\n            <p>You are creating a private and encrypted Chat Room. You will have to invite people to this room.</p>\n            <div class=\'form-group\'>\n              <label for="name" class=\'modal-form-label\'>Name:</label>\n              <input id="name" name="name" placeholder=\'Enter room name\' class="modal-form-input"/>\n            </div>\n            <div class=\'form-group mb-0\'>\n              <label for="policy" class=\'modal-form-label\'>Description / Policy:</label>\n              <textarea id="policy" name="policy" placeholder="Enter room policy" rows="4" class="modal-form-textarea"></textarea>\n            </div>\n          </form>\n        '
            }
            hydra.client.showModal({
                title: "Create new Chat Room",
                prompt: o,
                buttons: [{
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Create",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        $("#create-new-room-form").submit(),
                        hydra.client.closeModal()
                    }
                }]
            })
        }
        togglePolicyEditor(e) {
            let t = e.currentTarget.getAttribute("data-policy");
            hydra.client.showModal({
                title: "Edit Room Policy",
                prompt: `\n        <form id='policy-editor-form' method='POST' action='/chat/${this.chatRoom._id}/edit/policy'>\n          <div class='form-group'>\n            <label for="policy" class='modal-form-label'>Policy:</label>\n            <textarea id="policy" name="policy" placeholder="Enter room policy" rows="4" class="modal-form-textarea">${t}</textarea>\n          </div>\n        </form>\n      `,
                buttons: [{
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Update",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        $("#policy-editor-form").submit(),
                        hydra.client.closeModal()
                    }
                }]
            })
        }
        collapseRoomListGroup(e) {
            let t = e.currentTarget.getAttribute("data-room-list-group-name")
              , o = document.querySelector(`.room-list-group[data-room-list-group-name="${t}"]`);
            o && o.classList.toggle("room-list-group--collapsed")
        }
        filterRooms() {
            let e = this
              , t = e.roomFilterInput.value.toLowerCase();
            for (let o = 0; o < e.roomItems.length; o++) {
                let r = e.roomItems[o]
                  , a = !t || r.getAttribute("data-room-name").toLowerCase().indexOf(t) > -1;
                e.roomItems[o].classList.toggle("hidden", !a)
            }
        }
        toggleMenu(e) {
            return e && (e.preventDefault(),
            e.stopPropagation()),
            this.chatSpace.classList.toggle("chat-space--sidebar-open"),
            !1
        }
        updateChatInputHeight() {
            this.chatInput.style.height = "1px",
            this.chatInput.style.height = 4 + this.chatInput.scrollHeight + "px"
        }
        onChatInputKeyUp() {
            this.updateChatInputHeight()
        }
        onChatInputKeyDown(e) {
            let t = this;
            if (e.shiftKey || "enter" !== e.key.toLowerCase())
                t.updateChatInputHeight(e);
            else
                switch (e.preventDefault(),
                t.roomType) {
                case "PrivateMessageRoom":
                    return t.sendPrivateMessage();
                case "ChatRoom":
                    return t.sendChatMessage()
                }
        }
        onAttachmentChanged(e) {
            let t = this;
            if (0 === e.target.files.length)
                return;
            let o = new FileReader;
            o.onload = (e=>{
                t.attachmentPreview.src = e.target.result,
                t.attachmentPanel.classList.add("message-input-attachment--open")
            }
            ),
            o.readAsDataURL(e.target.files[0])
        }
        clearAttachment() {
            this.attachmentInput.value = "",
            this.attachmentPreview.src = "",
            this.attachmentPanel.classList.remove("message-input-attachment--open")
        }
        toggleChatRoomGutter(e, t) {
            e.preventDefault(),
            this.chatSpace.classList.toggle("chat-space--gutter-open"),
            this.toggleChatRoomGutterItem(e, t, !0)
        }
        toggleChatRoomGutterItem(e, t, o) {
            let r = document.querySelector(`.chat-room-gutter-item[data-gutter-item="${t}"]`);
            r && (o ? r.classList.toggle("chat-room-gutter-item--open", o) : r.classList.toggle("chat-room-gutter-item--open"))
        }
        postChatMessage(e) {
            return e.preventDefault(),
            this.sendChatMessage()
        }
        sendChatMessage() {
            let e = this
              , t = document.getElementById("chat-input-form")
              , o = document.getElementById("chat-input")
              , r = t.getAttribute("data-chat-room-id")
              , a = o.value.trim();
            if (o.focus(),
            "" === a || a.length < 2)
                return window.alert("Chat text cannot be empty or very short."),
                !0;
            if (a === e.lastChatContent)
                return window.alert("You already sent that message"),
                !0;
            if (e.interpretSlashCommand(a))
                return o.value = "",
                !0;
            e.clearNewRoomMessage();
            let s, n = [];
            return e.currentChatRoom.flags.public || (console.log("encrypting chat message to private room"),
            n.push(hydra.e2e.encryptToChatRoom(e.currentChatRoom, a).then(e=>{
                s = e
            }
            ))),
            Promise.all(n).then(()=>{
                let t = `/chat/${r}/message`
                  , o = {};
                return e.currentChatRoom.flags.public ? o.content = a : o.payload = s,
                fetch(t, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(o)
                })
            }
            ).then(e=>e.json()).then(t=>{
                if (!t.success)
                    return Promise.reject(new Error(t.message));
                o.value = "",
                e.lastChatContent = a
            }
            ).catch(e=>{
                console.log("failed to post message", e),
                hydra.client.showModal({
                    title: "Chat room error",
                    prompt: e.message,
                    buttons: [{
                        label: "OK",
                        class: "btn-primary",
                        onclick: ()=>{
                            hydra.client.closeModal()
                        }
                    }]
                })
            }
            ),
            !0
        }
        postPrivateMessage(e) {
            return e.preventDefault(),
            this.sendPrivateMessage()
        }
        sendPrivateMessage() {
            let e = this
              , t = document.getElementById("chat-input-form")
              , o = document.getElementById("chat-input")
              , r = t.getAttribute("data-chat-room-id")
              , a = o.value.trim();
            if (o.focus(),
            "" === a || a.length < 2)
                return window.alert("Private messages cannot be empty or very short."),
                !0;
            if (a === e.lastChatContent)
                return window.alert("You already sent that message"),
                !0;
            e.clearNewRoomMessage();
            let s = `/private-message/${r}/message`;
            return hydra.e2e.encryptToChatRoom(e.currentChatRoom, a).then(e=>(console.log("encrypted message", {
                payload: e
            }),
            fetch(s, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    payload: e
                })
            }))).then(e=>e.json()).then(t=>{
                if (!t.success)
                    return Promise.reject(new Error(t.message));
                o.value = "",
                e.lastChatContent = a
            }
            ).catch(e=>{
                console.log("sendPrivateMessage error", {
                    error: e
                }),
                hydra.client.showModal({
                    title: "Private Message error",
                    prompt: e.message,
                    buttons: [{
                        label: "OK",
                        class: "btn-primary",
                        onclick: ()=>{
                            hydra.client.closeModal()
                        }
                    }]
                })
            }
            ),
            !0
        }
        onChatRoomJoinResult(e) {
            var t = this;
            return console.log("onChatRoomJoinResult", e),
            e.success ? e.chatRoom ? (t.checkActiveMemberCount(),
            console.log("setting current chat room", {
                chatRoom: e.chatRoom
            }),
            t.currentChatRoom = e.chatRoom,
            t.isChatRoomEncrypted() ? hydra.e2e.onJoinChatRoom(t.currentChatRoom).then(()=>(t.setLoadingPrompt("decrypting room messages"),
            Promise.all(t.decryptHtmlChatMessages()))).then(()=>{
                console.debug("Chat is ready."),
                document.dispatchEvent(new Event("hydra-chat-ready"))
            }
            ).catch(e=>{
                console.error("onJoinChatRoom error", e),
                window.alert(e.message),
                window.location = "/user"
            }
            ) : void document.dispatchEvent(new Event("hydra-chat-ready"))) : Promise.resolve() : Promise.reject(new Error(e.message))
        }
        setLoadingPrompt(e) {
            let t = document.querySelector(".chat-loading-overlay .loading-prompt");
            t && (t.textContent = e)
        }
        setLoadingProgress(e) {
            let t = document.getElementById("hydra-chat-loading-progress");
            t && (t.style.width = `${100 * e}%`)
        }
        showLoadingOverlay() {
            document.querySelectorAll(".chat-loading-overlay").forEach(e=>{
                e.classList.remove("d-none"),
                e.classList.add("d-flex")
            }
            )
        }
        hideLoadingOverlay() {
            document.querySelectorAll(".chat-loading-overlay").forEach(e=>{
                e.classList.remove("d-flex"),
                e.classList.add("d-none")
            }
            )
        }
        lockRoom() {
            let e = this;
            e.isLocked || (e.isLocked = !0,
            e.chatInput && (e.chatInput.disabled = "disabled",
            e.chatInput.setAttribute("placeholder", "Room unlocks when others arrive..."),
            e.sendMessageButton && (e.sendMessageButton.disabled = "disabled")),
            document.querySelectorAll(".chat-locked-overlay").forEach(e=>{
                e.classList.remove("d-none"),
                e.classList.add("d-flex")
            }
            ))
        }
        unlockRoom() {
            let e = this;
            e.isLocked && (e.isLocked = !1,
            e.chatInput && (e.chatInput.removeAttribute("disabled"),
            e.chatInput.setAttribute("placeholder", "Type an encrypted message..."),
            e.sendMessageButton && e.sendMessageButton.removeAttribute("disabled")),
            document.querySelectorAll(".chat-locked-overlay").forEach(e=>{
                e.classList.remove("d-flex"),
                e.classList.add("d-none")
            }
            ))
        }
        checkActiveMemberCount() {
            if (this.isPrivateMessageRoom()) {
                var e = document.querySelectorAll('.chat-room-gutter-item[data-gutter-item="members"] .chat-room-member-item')
                  , t = 0;
                if (e.forEach(e=>{
                    "active" === e.getAttribute("data-member-status") && ++t
                }
                ),
                t >= 2)
                    return console.debug("unlocking active room", {
                        activeMemberCount: t
                    }),
                    this.unlockRoom();
                console.debug("locking empty room", {
                    activeMemberCount: t
                }),
                this.lockRoom()
            }
        }
        isPrivateMessageRoom() {
            return !!this.currentChatRoom && !this.currentChatRoom.flags
        }
        isChatRoomEncrypted() {
            return !(!this.currentChatRoom || !this.isPrivateMessageRoom() && this.currentChatRoom.flags.public)
        }
        onUserJoin(e) {
            var t = this;
            if (!t.isChatRoomEncrypted())
                return;
            t.chatRoom.members = t.chatRoom.members || [];
            let o = t.chatRoom.members.find(t=>e._id === t._id);
            if (!o || !o.secretKey)
                return console.debug("importing new room member"),
                hydra.e2e.importRoomMember(e).then(()=>{
                    if (t.isPrivateMessageRoom())
                        return t.chatRoom.members.push(e),
                        document.querySelectorAll(`.chat-room-member-item[data-member-id="${e._id}"]`).forEach(t=>{
                            t.setAttribute("data-member-status", e.status)
                        }
                        ),
                        t.checkActiveMemberCount()
                }
                );
            console.debug("already have room member")
        }
        onChatMessage(e) {
            var t = this
              , o = t.isUserScrolling;
            if (!t.blockedUsers.includes(e.senderId)) {
                if ("user-join" === e.event)
                    return t.onUserJoin(e.user);
                if ("set-user-status" === e.event)
                    return t.onSetUserStatus(e);
                t.chatMessageList = document.getElementById("chat-messages"),
                t.chatMessageList.insertAdjacentHTML("beforeend", e.message),
                t.localizeMessageTimestamps();
                var r = t.decryptHtmlChatMessages();
                return t.chatMessageList.querySelectorAll(".message:not([data-rendered])").forEach(e=>{
                    let o, r, a = e.getAttribute("data-author-id"), s = e.querySelector(".message-actions__container");
                    for (; s.firstChild; )
                        s.removeChild(s.firstChild);
                    a === hydra.data.user._id ? ((o = document.createElement("button")).classList.add("message-actions__btn"),
                    o.setAttribute("type", "button"),
                    o.setAttribute("title", "Delete this message"),
                    o.setAttribute("data-message-id", e.getAttribute("data-message-id")),
                    o.addEventListener("click", e=>t.deleteChatMessage(e)),
                    s.appendChild(o),
                    (r = document.createElement("i")).classList.add("fa"),
                    r.classList.add("fa-trash"),
                    r.classList.add("message-actions__btn__icon"),
                    o.appendChild(r),
                    (o = document.createElement("button")).classList.add("message-actions__btn"),
                    o.setAttribute("type", "button"),
                    o.setAttribute("title", "Edit this message"),
                    o.setAttribute("data-message-id", e.getAttribute("data-message-id")),
                    o.addEventListener("click", e=>t.editChatMessage(e)),
                    s.appendChild(o),
                    (r = document.createElement("i")).classList.add("fa"),
                    r.classList.add("fa-pencil-alt"),
                    r.classList.add("message-actions__btn__icon"),
                    o.appendChild(r)) : (t.isCurrentRoomModerator() && (s.appendChild(t.createMessageActionButton(e, {
                        title: `Mute ${e.getAttribute("data-author-username")}`,
                        icon: "fa-microphone-alt-slash",
                        onclick: e=>hydra.chat.muteUser(e)
                    })),
                    s.appendChild(t.createMessageActionButton(e, {
                        title: `Suspend ${e.getAttribute("data-author-username")}`,
                        icon: "fa-user-slash",
                        onclick: e=>hydra.chat.suspendUser(e)
                    }))),
                    a !== t.currentUser._id && s.appendChild(t.createMessageActionForm(e, {
                        action: "/private-message",
                        method: "POST",
                        title: `Start PM with ${e.getAttribute("data-author-username")}`,
                        icon: "fa-envelope"
                    })),
                    (o = document.createElement("button")).classList.add("message-actions__btn"),
                    o.setAttribute("title", "Block this user"),
                    o.setAttribute("data-user-id", e.getAttribute("data-author-id")),
                    o.setAttribute("data-username", e.getAttribute("data-author-username")),
                    o.setAttribute("data-message-id", e.getAttribute("data-message-id")),
                    o.addEventListener("click", e=>hydra.chat.blockUser(e)),
                    s.appendChild(o),
                    (r = document.createElement("i")).classList.add("fa"),
                    r.classList.add("fa-times-circle"),
                    r.classList.add("message-actions__btn__icon"),
                    o.appendChild(r),
                    (o = document.createElement("button")).classList.add("message-actions__btn"),
                    o.setAttribute("title", "Report this message"),
                    o.setAttribute("data-user-id", e.getAttribute("data-author-id")),
                    o.setAttribute("data-username", e.getAttribute("data-author-username")),
                    o.setAttribute("data-message-id", e.getAttribute("data-message-id")),
                    o.addEventListener("click", e=>t.reportUser(e)),
                    s.appendChild(o),
                    (r = document.createElement("i")).classList.add("fa"),
                    r.classList.add("fa-flag"),
                    r.classList.add("message-actions__btn__icon"),
                    o.appendChild(r)),
                    e.setAttribute("data-rendered", "")
                }
                ),
                Promise.all(r).catch(e=>{
                    console.log("onChatMessage error", e)
                }
                ).finally(()=>{
                    o || t.scrollToBottom(),
                    hydra.notifications.indicateActivity()
                }
                )
            }
            console.log("rejecting message from blocked user")
        }
        createMessageActionButton(e, t) {
            let o = document.createElement("button");
            if (o.classList.add("message-actions__btn"),
            o.setAttribute("data-user-id", e.getAttribute("data-author-id")),
            o.setAttribute("data-username", e.getAttribute("data-author-username")),
            o.setAttribute("data-message-id", e.getAttribute("data-message-id")),
            t.title && o.setAttribute("title", t.title),
            t.onclick && o.addEventListener("click", t.onclick),
            t.icon) {
                let e = document.createElement("i");
                e.classList.add("fa"),
                e.classList.add(t.icon),
                e.classList.add("message-actions__btn__icon"),
                o.appendChild(e)
            }
            return o
        }
        createMessageActionForm(e, t) {
            let o = document.createElement("form");
            o.setAttribute("action", t.action),
            o.setAttribute("method", t.method);
            let r = document.createElement("input");
            r.setAttribute("type", "hidden"),
            r.setAttribute("name", "username"),
            r.setAttribute("value", e.getAttribute("data-author-username")),
            o.appendChild(r);
            let a = document.createElement("button");
            if (a.classList.add("message-actions__btn"),
            a.setAttribute("type", "submit"),
            o.appendChild(a),
            t.title && a.setAttribute("title", t.title),
            t.icon) {
                let e = document.createElement("i");
                e.classList.add("fa"),
                e.classList.add(t.icon),
                e.classList.add("message-actions__btn__icon"),
                a.appendChild(e)
            }
            return o
        }
        onDeleteChatMessage(e) {
            console.log("onDeleteChatMessage", e),
            document.querySelectorAll(`.message[data-message-id="${e.messageId}"]`).forEach(e=>{
                e.parentElement.removeChild(e)
            }
            )
        }
        onSetUserStatus(e) {
            return console.debug("set-user-status", e),
            "suspended" === e.status || "muted" === e.status ? this.removeMember(e.userId) : this.onUserJoin(e.user)
        }
        inviteUserToChatRoom(e) {
            e.preventDefault();
            let t = document.getElementById("user-invite-form").getAttribute("data-chat-room-id")
              , o = document.getElementById("user-invite-username")
              , r = o.value.trim();
            "@" === r[0] && (r = r.slice(1)),
            console.log(t, r),
            fetch(`/chat/${t}/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    roomType: "ChatRoom",
                    username: r
                })
            }).then(e=>e.json()).then(e=>{
                console.debug("chat room invite response", e),
                o.value = "",
                hydra.client.showModal({
                    title: e.title || "Invite failed",
                    prompt: e.message
                })
            }
            ).catch(e=>{
                o.value = "",
                hydra.client.showModal({
                    title: "Invitation error",
                    prompt: e.message,
                    buttons: [{
                        label: "OK",
                        class: "btn-primary",
                        onclick: ()=>{
                            hydra.client.closeModal()
                        }
                    }]
                })
            }
            )
        }
        acceptChatRoomInvite(e) {
            let t = JSON.parse(e.target.getAttribute("data-invitation"));
            console.log(e, t),
            fetch(`/chat/${t.chatRoom._id}/invitation/${t._id}/accept`, {
                method: "POST"
            }).then(e=>(console.log("first response", e),
            e.ok ? e.json() : Promise.reject(new Error(`${e.status}: ${e.statusText}`)))).then(e=>{
                console.log("second response", e),
                window.location.reload()
            }
            ).catch(e=>{
                console.log("failed to accept invitation", e)
            }
            )
        }
        rejectChatRoomInvite(e) {
            let t = JSON.parse(e.target.getAttribute("data-invitation"));
            console.log(e, t),
            fetch(`/chat/${t.chatRoom._id}/invitation/${t._id}/reject`, {
                method: "POST"
            }).then(e=>(console.log("first response", e),
            e.ok ? e.json() : Promise.reject(new Error(`${e.status}: ${e.statusText}`)))).then(e=>{
                console.log("second response", e),
                window.location.refresh()
            }
            ).catch(e=>{
                console.log("failed to reject invitation", e)
            }
            )
        }
        editChatMessage(e) {
            let t = e.target.getAttribute("data-message-id");
            console.log("editChatMessage", e, t),
            hydra.client.showModal({
                title: "Edit chat message",
                prompt: '<p class="color-subtitle mb-0">Message editing will be added soon.</p>',
                buttons: [{
                    label: "OK",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }]
            })
        }
        deleteChatMessage(e) {
            var t = e.target.getAttribute("data-message-id") || e.currentTarget.getAttribute("data-message-id");
            if (!t)
                return window.alert("The message cannot be deleted."),
                e.preventDefault(),
                !0;
            console.log("deleteChatMessage", e, t),
            hydra.client.showModal({
                title: "Delete chat message",
                prompt: '<p class="color-subtitle mb-0">Are you sure you want to delete the message? It will be removed from everyone\'s view.</p>',
                buttons: [{
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Yes, Delete",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        fetch(`/chat/message/${t}`, {
                            method: "DELETE"
                        }).then(e=>e.ok ? e.json() : Promise.reject(new Error("failed to delete chat message"))).then(e=>{
                            console.log("delete message response", e)
                        }
                        ).finally(()=>{
                            hydra.client.closeModal()
                        }
                        )
                    }
                }]
            })
        }
        sendInvitationStatusMessage(e) {
            e.preventDefault(),
            e.stopPropagation();
            var t = e.currentTarget.getAttribute("data-room-type")
              , o = e.currentTarget.getAttribute("data-room-id")
              , r = this.getStatusMessageInputText();
            return this.postStatusMessage(r).then(e=>{
                if (!e.success)
                    return Promise.reject(new Error(e.message));
                hydra.client.showModal({
                    title: "Invitation sent",
                    prompt: e.message,
                    buttons: [{
                        label: "Dismiss",
                        class: "btn-primary",
                        onclick: ()=>{
                            window.location = `/${t}/${o}`
                        }
                    }]
                })
            }
            ).catch(e=>{
                console.error(e),
                hydra.client.closeModal(),
                window.alert(e.message)
            }
            )
        }
        sendStatusMessage(e) {
            e.preventDefault(),
            e.stopPropagation();
            let t = this.getStatusMessageInputText();
            return this.postStatusMessage(t).then(e=>{
                if (!e.success)
                    return Promise.reject(new Error(e.message));
                hydra.client.showModal({
                    title: "Invitation sent",
                    prompt: e.message,
                    buttons: [{
                        label: "Dismiss",
                        class: "btn-primary",
                        onclick: ()=>{
                            hydra.client.closeModal()
                        }
                    }]
                })
            }
            ).catch(e=>{
                console.error(e),
                hydra.client.closeModal(),
                window.alert(e.message)
            }
            )
        }
        getStatusMessageInputText() {
            let e = document.getElementById("status-message-text");
            if (!e)
                throw new Error("no status-message-text element found");
            let t = e.value;
            if ("string" != typeof t || !t.length)
                throw new Error("Status message text can't be empty.");
            return t
        }
        postStatusMessage(e) {
            return fetch("/gab/status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: e
                })
            }).then(e=>e.json())
        }
        addToSpotlight(e) {
            let t = e.currentTarget.getAttribute("data-username")
              , o = e.currentTarget.getAttribute("data-user-id");
            console.log("addToSpotlight", e.currentTarget, o, t)
        }
        leaveChatRoom(e) {
            var t = e.currentTarget.getAttribute("data-chat-room-id");
            fetch(`/chat/${t}/membership`, {
                method: "DELETE"
            }).then(e=>e.ok ? e.json() : Promise.reject(new Error("Failed to leave chat room."))).then(e=>{
                if (console.log("leave room", e),
                !e.success)
                    return Promise.reject(e.message);
                window.location = "/chat/global"
            }
            ).catch(e=>{
                window.alert(`Error: ${e.message}`)
            }
            )
        }
        mentionUser(e) {
            let t = e.currentTarget.getAttribute("data-username");
            console.log("mentionUser", e.currentTarget, t),
            document.getElementById("chat-input").value += `@${t} `
        }
        blockUser(e) {
            var t = this
              , o = e.target.getAttribute("data-username") || e.currentTarget.getAttribute("data-username")
              , r = e.target.getAttribute("data-user-id") || e.currentTarget.getAttribute("data-user-id");
            e.preventDefault(),
            e.stopPropagation(),
            hydra.client.showModal({
                title: `Block ${o}`,
                prompt: `<form><p class="color-subtitle mb-0">Are you sure you want to block <span class="color-text">${o}</span> ?</p>`,
                buttons: [{
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Yes, Block",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        fetch("/user/block", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                userId: r
                            })
                        }).then(e=>e.json()).then(e=>{
                            if (!e.success)
                                return Promise.reject(new Error(e.message));
                            t.removeUserMessages(r),
                            t.blockedUsers.push(r),
                            window.sessionStorage.blockedUsers = JSON.stringify(t.blockedUsers)
                        }
                        ).catch(e=>{
                            window.alert(e.message)
                        }
                        ).finally(()=>{
                            hydra.client.closeModal()
                        }
                        )
                    }
                }]
            })
        }
        setUserActive(e) {
            e.preventDefault(),
            e.stopPropagation();
            var t = e.target.getAttribute("data-user-id") || e.currentTarget.getAttribute("data-user-id")
              , o = e.target.getAttribute("data-username") || e.currentTarget.getAttribute("data-username");
            return this.askActivateUser(t, o),
            !0
        }
        askActivateUser(e, t) {
            var o = this;
            hydra.client.showModal({
                title: `Mute ${t}`,
                prompt: `<form><p class="color-subtitle mb-0">Are you sure you want to re-activate <span class="color-text">${t}</span> ?</p>`,
                buttons: [{
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Yes, Re-activate",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        fetch(`/chat/${o.currentChatRoom._id}/set-active`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                userId: e
                            })
                        }).then(e=>e.json()).then(t=>{
                            if (!t.success)
                                return Promise.reject(new Error(t.message));
                            o.removeUserFromMemberList("muted-members", e),
                            o.removeUserFromMemberList("suspended-members", e),
                            window.alert(t.message)
                        }
                        ).catch(e=>{
                            window.alert(e.message)
                        }
                        ).finally(()=>{
                            hydra.client.closeModal()
                        }
                        )
                    }
                }]
            })
        }
        muteUser(e) {
            e.preventDefault(),
            e.stopPropagation();
            var t = e.target.getAttribute("data-username") || e.currentTarget.getAttribute("data-username")
              , o = e.target.getAttribute("data-user-id") || e.currentTarget.getAttribute("data-user-id");
            return this.askMuteUser(o, t),
            !0
        }
        askMuteUser(e, t) {
            var o = this;
            hydra.client.showModal({
                title: `Mute ${t}`,
                prompt: `<form><p class="color-subtitle mb-0">Are you sure you want to mute <span class="color-text">${t}</span> ?</p>`,
                buttons: [{
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Yes, Mute",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        fetch(`/chat/${o.currentChatRoom._id}/mute`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                userId: e
                            })
                        }).then(e=>e.json()).then(t=>{
                            if (!t.success)
                                return Promise.reject(new Error(t.message));
                            o.removeMember(e),
                            window.alert(t.message)
                        }
                        ).catch(e=>{
                            window.alert(e.message)
                        }
                        ).finally(()=>{
                            hydra.client.closeModal()
                        }
                        )
                    }
                }]
            })
        }
        suspendUser(e) {
            e.preventDefault(),
            e.stopPropagation();
            var t = e.target.getAttribute("data-username") || e.currentTarget.getAttribute("data-username")
              , o = e.target.getAttribute("data-user-id") || e.currentTarget.getAttribute("data-user-id");
            return this.askSuspendUser(o, t),
            !0
        }
        askSuspendUser(e, t) {
            var o = this;
            hydra.client.showModal({
                title: `Suspend ${t}`,
                prompt: `<form><p class="color-subtitle mb-0">Are you sure you want to suspend <span class="color-text">${t}</span> ?</p>`,
                buttons: [{
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Yes, Suspend",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        fetch(`/chat/${o.currentChatRoom._id}/suspend`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                userId: e
                            })
                        }).then(e=>e.json()).then(t=>{
                            if (!t.success)
                                return Promise.reject(new Error(t.message));
                            o.removeMember(e),
                            window.alert(t.message)
                        }
                        ).catch(e=>{
                            window.alert(e.message)
                        }
                        ).finally(()=>{
                            hydra.client.closeModal()
                        }
                        )
                    }
                }]
            })
        }
        getBlockedUsers() {
            var e = this
              , t = JSON.parse(window.sessionStorage.blockedUsers || "[ ]");
            return t && t.length ? (e.blockedUsers = t,
            Promise.resolve(t)) : fetch("/user/blocked-users").then(e=>e.json()).then(t=>t.success ? (e.blockedUsers = t.blockedUsers,
            window.sessionStorage.blockedUsers = JSON.stringify(t.blockedUsers),
            Promise.resolve(e.blockedUsers)) : Promise.reject(new Error(t.message)))
        }
        isUserBlocked(e) {
            return -1 !== this.blockedUsers.indexOf(e)
        }
        unblockUser(e) {
            var t = e.currentTarget.getAttribute("data-user-id")
              , o = e.currentTarget.getAttribute("data-username");
            hydra.client.showModal({
                title: "Un-block user",
                prompt: `Are you sure you want to un-block user: ${o}?`,
                buttons: [{
                    label: "Cancel",
                    class: "btn-secondary",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: `Un-block ${o}`,
                    class: "btn-danger",
                    onclick: ()=>{
                        fetch("/user/block", {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                userId: t
                            })
                        }).then(e=>e.json()).then(e=>{
                            if (!e.success)
                                return Promise.reject(new Error(e.message));
                            document.querySelectorAll(`li.list-group-item[data-user-id="${t}"]`).forEach(e=>{
                                e.parentElement.removeChild(e)
                            }
                            )
                        }
                        ).catch(e=>{
                            console.error("unblockUser error", e),
                            window.alert(`Failed to un-block ${o}: ${e.message}`)
                        }
                        ).finally(()=>{
                            hydra.client.closeModal()
                        }
                        )
                    }
                }]
            })
        }
        reportUser(e) {
            let t = e.currentTarget.getAttribute("data-username")
              , o = e.currentTarget.getAttribute("data-message-id");
            hydra.client.showModal({
                title: `Report ${t}`,
                prompt: `<p class="color-subtitle mb-0">Are you sure you want to report <span class="color-text">${t}</span> ?</p>`,
                buttons: [{
                    label: "Cancel",
                    class: "modal-btn-cancel",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Yes, Report",
                    class: "modal-btn-primary",
                    onclick: ()=>{
                        hydra.client.closeModal(),
                        fetch(`/chat/report/message/${o}`, {
                            method: "POST"
                        }).then(e=>e.json()).then(e=>{
                            if (!e.success)
                                return Promise.reject(new Error(e.message));
                            window.alert(e.message)
                        }
                        ).catch(e=>{
                            window.alert(e.message)
                        }
                        )
                    }
                }]
            })
        }
        loadMoreMessages() {
            this.fetchMoreMessages()
        }
        fetchMoreMessages() {
            var e = this
              , t = e.scrollSentinelBtn.getAttribute("data-room-id")
              , o = e.scrollSentinelBtn.getAttribute("data-oldest-id");
            return e.isFetchingMessages = !0,
            fetch(`/message/${t}?lt=${o}`).then(e=>e.json()).then(t=>{
                if (!t.success)
                    return Promise.reject(new Error(t.message));
                if (!t.messages || !t.messages.length)
                    return e.removeScrollSentinel(),
                    Promise.resolve();
                var o = e.removeScrollSentinel()
                  , r = e.chatMessageList.scrollTop
                  , a = e.chatMessageList.scrollHeight;
                return t.messages.forEach(t=>{
                    e.scrollSentinelBtn.setAttribute("data-oldest-id", t._id),
                    e.chatMessageList.insertAdjacentHTML("afterbegin", t.message)
                }
                ),
                t.messages.length >= 20 && (e.chatMessageList.prepend(e.scrollSentinelContainer),
                e.scrollSentinel = o),
                Promise.all(e.decryptHtmlChatMessages()).then(()=>{
                    var t = e.chatMessageList.scrollHeight - a;
                    e.chatMessageList.scrollTop = r + t
                }
                )
            }
            ).catch(e=>{
                console.error("loadMoreChatMessages error", e),
                window.alert(e.message)
            }
            ).finally(()=>(e.isFetchingMessages = !1,
            Promise.resolve()))
        }
        checkUserScroll() {
            let e = this;
            if (e.chatMessageList)
                return e.chatMessageList.offsetHeight + e.chatMessageList.scrollTop + 16 >= e.chatMessageList.scrollHeight ? (e.chatMessageList.classList.remove("is-scroll-locked"),
                void (e.isUserScrolling = !1)) : (e.chatMessageList.classList.add("is-scroll-locked"),
                void (e.isUserScrolling = !0));
            e.isUserScrolling = !1
        }
        checkScrollSentinel() {
            if (this.scrollSentinel) {
                var e = this.scrollSentinelContainer.getBoundingClientRect()
                  , t = this.scrollSentinel.getBoundingClientRect().bottom + e.top;
                this.isFetchingMessages || t < -100 || (this.isFetchingMessages = !0,
                this.scrollSentinelBtn.click())
            }
        }
        removeScrollSentinel() {
            if (this.scrollSentinel) {
                var e = this.scrollSentinel;
                return this.scrollSentinel = null,
                this.scrollSentinelContainer.parentElement.removeChild(this.scrollSentinelContainer),
                e
            }
        }
        deleteChatRoom(e) {
            let t = this
              , o = e.currentTarget.getAttribute("data-chat-room-id")
              , r = e.currentTarget.getAttribute("data-chat-room-name");
            console.log("deleteChatRoom", e, o, r),
            hydra.client.showModal({
                title: "Destroy chat room",
                prompt: `<p class='color-subtitle mb-0'>Are you sure you want to destroy chat room '${r}'.</p>`,
                buttons: [{
                    label: "Destroy",
                    class: "btn-danger",
                    onclick: ()=>{
                        t.doDeleteChatRoom(e, o, r)
                    }
                }, {
                    label: "Cancel",
                    class: "btn-secondary",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }]
            })
        }
        doDeleteChatRoom(e, t, o) {
            let r = this;
            console.log("doDeleteChatRoom", e, t, o),
            hydra.client.showModal({
                title: "Destroying chat room",
                prompt: `<p class='color-subtitle mb-0'>Please wait while chat room '${o}' is destroyed.</p>`,
                buttons: [{
                    label: "Cancel",
                    class: "btn-secondary",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }]
            }),
            fetch(`/chat/${t}`, {
                method: "DELETE"
            }).then(e=>e.json()).then(e=>{
                if (!e.success)
                    return Promise.reject(new Error(e.message));
                let o = document.querySelectorAll(`li[data-room-id="${t}"`);
                o.forEach(e=>{
                    e.parentElement.removeChild(e)
                }
                ),
                r.currentChatRoom ? window.location = "/chat" : (console.log("doDeleteChatRoom", e, o),
                hydra.client.closeModal())
            }
            ).catch(e=>{
                console.log("doDeleteChatRoom error", e),
                hydra.client.showModal({
                    title: "System error",
                    prompt: `<p class="color-subtitle mb-0">Failed to destroy chat room. ${e.message}</p>`,
                    buttons: [{
                        label: "OK",
                        class: "btn-primary",
                        onclick: ()=>{
                            hydra.client.closeModal()
                        }
                    }]
                })
            }
            )
        }
        leavePrivateMessageGroup(e) {
            let t = e.currentTarget.getAttribute("data-chat-room-id");
            fetch(`/private-message/${t}/membership`, {
                method: "DELETE"
            }).then(e=>e.ok ? e.json() : Promise.reject(new Error("Failed to leave Private Message Group"))).then(e=>{
                if (!e.success)
                    return Promise.reject(new Error(e.message));
                window.location = "/chat/global"
            }
            ).catch(e=>{
                window.alert(`Failed to leave Private Message Group: ${e.message}`)
            }
            )
        }
        deletePrivateMessageRoom(e) {
            let t = this
              , o = e.currentTarget.getAttribute("data-chat-room-id");
            console.log("deletePrivateMessageRoom", e, o),
            hydra.client.showModal({
                title: "Leave private messaging room",
                prompt: '<p class="color-subtitle mb-0">Are you sure you want to leave this private message group.</p>',
                buttons: [{
                    label: "Yes",
                    class: "btn-danger",
                    onclick: ()=>{
                        t.doDeletePrivateMessageRoom(e, o)
                    }
                }, {
                    label: "Cancel",
                    class: "btn-secondary",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }]
            })
        }
        doDeletePrivateMessageRoom(e, t) {
            let o = this;
            console.log("doDeletePrivateMessageRoom", e, t),
            hydra.client.showModal({
                title: "Leaving private messaging room",
                prompt: '<p class="color-subtitle mb-0">Leaving private message group. Please wait...</p>',
                buttons: [{
                    label: "Cancel",
                    class: "btn-secondary",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }]
            }),
            fetch(`/private-message/${t}`, {
                method: "DELETE"
            }).then(e=>e.ok ? e.json() : Promise.reject(new Error("Failed to destroy private message group."))).then(e=>{
                let r = document.querySelectorAll(`li[data-dmroom-id="${t}"`);
                r.forEach(e=>{
                    e.parentElement.removeChild(e)
                }
                ),
                o.currentChatRoom ? window.location = "/chat" : (console.log("doDeletePrivateMessageRoom", e, r),
                hydra.client.closeModal())
            }
            ).catch(e=>{
                console.log("doDeletePrivateMessageRoom error", e),
                hydra.client.showModal({
                    title: "System error",
                    prompt: '<p class="color-subtitle mb-0">Failed to leave private message group.</p>',
                    buttons: [{
                        label: "OK",
                        class: "btn-primary",
                        onclick: ()=>{
                            hydra.client.closeModal()
                        }
                    }]
                })
            }
            )
        }
        clearNewRoomMessage() {
            const e = document.getElementById("new-room-message");
            e && e.remove()
        }
        decryptHtmlChatMessages() {
            var e = this
              , t = e.chatMessageList.querySelectorAll(".message__body[data-iv]")
              , o = []
              , r = t.length
              , a = 0;
            return t.forEach(t=>{
                if (++a,
                "true" !== t.getAttribute("data-is-processed"))
                    return t.getAttribute("data-recipient-id") !== hydra.data.user._id ? (t.parentElement.removeChild(t),
                    void e.setLoadingProgress(a / r)) : void o.push(hydra.e2e.decryptMessage(e.currentChatRoom, t).then(()=>{
                        t.setAttribute("data-is-processed", "true")
                    }
                    ).catch(()=>(t.setAttribute("data-is-processed", "true"),
                    Promise.resolve())).finally(()=>(e.setLoadingProgress(a / r),
                    Promise.resolve())));
                e.setLoadingProgress(a / r)
            }
            ),
            o
        }
        interpretSlashCommand(e) {
            if ("/" !== e[0])
                return !1;
            var t = e.slice(1).split(" ")
              , o = t.shift();
            switch (o.toLowerCase()) {
            case "help":
                this.interpretHelpCommand(t);
                break;
            case "mute":
                this.interpretMuteCommand(t);
                break;
            case "suspend":
                this.interpretSuspendCommand(t);
                break;
            case "set-active":
                this.interpretSetActiveCommand(t);
                break;
            default:
                this.appendSystemError(`<strong>/${o}</strong>: unknown slash command (see /help)`)
            }
            return !0
        }
        interpretHelpCommand() {
            this.appendSystemMessage("\n      <h5>Chat slash commands:</h5>\n      <ul>\n        <li><strong>/mute [username]</strong><br />prevent user from posting to the room.</li>\n        <li><strong>/suspend [username]</strong><br />prevent user from being in the room.</li>\n        <li><strong>/set-active [username]</strong><br />restore user to active status.</li>\n      </ul>\n    ")
        }
        interpretSetActiveCommand(e) {
            var t = this
              , o = e.shift();
            o ? (t.isCurrentRoomModerator() || t.appendSystemError("This slash command is limited to room moderators and owners. You are not the owner of this room (or a moderator)."),
            hydra.client.resolveUser(o).then(e=>(console.debug("resolved user", {
                username: o,
                user: e
            }),
            t.askActivateUser(e._id, o),
            Promise.resolve())).catch(e=>{
                t.appendSystemError(`set-active error: ${e.message}`)
            }
            )) : window.alert("slash command set-active requires username")
        }
        interpretMuteCommand(e) {
            var t = this
              , o = e.shift();
            o ? (t.isCurrentRoomModerator() || t.appendSystemError("This slash command is limited to room moderators and owners. You are not the owner of this room (or a moderator)."),
            hydra.client.resolveUser(o).then(e=>(console.debug("resolved user", {
                username: o,
                user: e
            }),
            t.askMuteUser(e._id, o),
            Promise.resolve())).catch(e=>{
                t.appendSystemError(`mute error: ${e.message}`)
            }
            )) : window.alert("slash command set-active requires username")
        }
        interpretSuspendCommand(e) {
            var t = this
              , o = e.shift();
            o ? (t.isCurrentRoomModerator() || t.appendSystemError("This slash command is limited to room moderators and owners. You are not the owner of this room (or a moderator)."),
            hydra.client.resolveUser(o).then(e=>(console.debug("resolved user", {
                username: o,
                user: e
            }),
            t.askSuspendUser(e._id, o),
            Promise.resolve())).catch(e=>{
                t.appendSystemError(`suspend error: ${e.message}`)
            }
            )) : window.alert("slash command set-active requires username")
        }
        removeMember(e) {
            document.querySelectorAll(`.chat-room-member-item[data-member-id="${e}"]`).forEach(e=>{
                e.parentElement.removeChild(e)
            }
            ),
            this.removeUserMessages(e),
            this.chatRoom.members && (this.chatRoom.members = this.chatRoom.members.filter(t=>t._id !== e))
        }
        removeUserFromMemberList(e, t) {
            let o = document.querySelector(`.chat-room-gutter-item[data-gutter-item="${e}"] .chat-room-member-item[data-member-id="${t}"]`);
            o && o.parentElement.removeChild(o)
        }
        removeUserMessages(e) {
            document.querySelectorAll(`.message[data-author-id="${e}"]`).forEach(e=>{
                e.parentElement.removeChild(e)
            }
            )
        }
        localizeMessageTimestamps() {
            document.querySelectorAll(".message__timestamp[data-msg-created]").forEach(e=>{
                let t = e.getAttribute("data-msg-created");
                t && (e.title = moment(t).format("hh:mm:ss"),
                e.textContent = moment(t).fromNow())
            }
            )
        }
        clearAllSavedData() {
            hydra.client.showModal({
                title: "Clear all stored data",
                prompt: "Are you sure you want to delete your private and public key along with all other saved data?",
                buttons: [{
                    label: "Cancel",
                    class: "btn-secondary",
                    onclick: ()=>{
                        hydra.client.closeModal()
                    }
                }, {
                    label: "Destroy All Data",
                    class: "btn-danger",
                    onclick: ()=>{
                        window.localStorage.clear(),
                        window.sessionStorage.clear(),
                        hydra.client.closeModal(),
                        window.location = "/"
                    }
                }]
            })
        }
        appendSystemMessage(e) {
            let t = document.createElement("div");
            t.classList.add("alert"),
            t.classList.add("alert-secondary"),
            t.innerHTML = e,
            this.chatMessageList.appendChild(t),
            this.scrollToBottom()
        }
        appendSystemError(e) {
            let t = document.createElement("div");
            t.classList.add("alert"),
            t.classList.add("alert-danger"),
            t.innerHTML = e,
            this.chatMessageList.appendChild(t),
            this.scrollToBottom()
        }
        shareToGab(e) {
            return e.preventDefault(),
            e.stopPropagation(),
            hydra.client.showModal({
                title: "Share to Gab",
                prompt: `\n        <form>\n          <textarea id="share-status-message" class="form-control" rows="4">\nI'm chatting in ${this.currentChatRoom.name} and thought you'd like to hop in here with us.\n\n:gab: https://chat.gab.com/chat/${this.currentChatRoom._id}\n          </textarea>\n        </form>\n      `,
                buttons: [{
                    label: "Share to Gab",
                    icon: "fa-hand-holding-heart",
                    class: "btn-primary",
                    onclick: ()=>{
                        let e = document.getElementById("share-status-message");
                        fetch("/gab/status", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                message: e.value
                            })
                        }).then(e=>e.json()).then(e=>{
                            if (!e.success)
                                return new Error(e.message);
                            window.alert(e.message)
                        }
                        ).catch(e=>{
                            console.error("shareToGab error", e),
                            window.alert(e.message)
                        }
                        ).finally(()=>{
                            hydra.client.closeModal()
                        }
                        )
                    }
                }]
            }),
            !0
        }
        shareToTwitter(e) {
            e.preventDefault();
            let t = `https://chat.gab.com/chat/${this.currentChatRoom._id}`
              , o = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm chatting in ${this.currentChatRoom.name} and thought you'd like to hop in here with us!`)}&url=${t}&via=getongab`;
            return window.open(o, "share-to-twitter", ""),
            !0
        }
        shareToTelegram(e) {
            e.preventDefault(),
            e.stopPropagation();
            let t = `https://telegram.me/share/url?url=${encodeURIComponent(`https://chat.gab.com/chat/${this.currentChatRoom._id}`)}&text=${encodeURIComponent(`I'm chatting in ${this.currentChatRoom.name} and thought you'd like to hop in here with us!`)}`;
            return window.open(t, "share-to-telegram", ""),
            !0
        }
        shareToFacebook(e) {
            e.preventDefault(),
            e.stopPropagation();
            let t = `https://chat.gab.com/chat/${this.currentChatRoom._id}`
              , o = ["https://www.facebook.com/dialog/share", "?app_id=507048810155691", "&display=page", `&href=${encodeURIComponent(t)}`].join("");
            return window.open(o, "share-to-facebook", ""),
            !0
        }
        shareToClipboard(e) {
            e.preventDefault();
            let t = `https://chat.gab.com/chat/${this.currentChatRoom._id}`
              , o = `I'm chatting in ${this.currentChatRoom.name} and thought you'd like to hop in here with us!`;
            return console.log(t, o),
            this.copyTextToClipboard(`${o}\n${t}`).then(()=>{
                window.alert("Link copied to clipboard.")
            }
            ).catch(e=>{
                console.error("Async: Could not copy text: ", e),
                window.alert("Failed to copy link to clipboard. You may need to grant Gab Trends permission to access the clipboard.")
            }
            ),
            !0
        }
        fallbackCopyTextToClipboard(e) {
            let t = !1
              , o = document.createElement("textarea");
            o.value = e,
            o.style.position = "fixed",
            document.body.appendChild(o),
            o.focus(),
            o.select();
            try {
                t = document.execCommand("copy")
            } catch (e) {
                console.error("unable to copy item to clipboard", e)
            }
            return document.body.removeChild(o),
            t
        }
        copyTextToClipboard(e) {
            let t = this;
            return navigator.clipboard ? navigator.clipboard.writeText(e) : t.fallbackCopyTextToClipboard(e) ? Promise.resolve() : Promise.reject(new Error("Failed to copy Trends item to clipboard"))
        }
    }
}();
hydra = window.hydra = window.hydra || {};
!function() {
    hydra.HydraClient = class {
        constructor() {
            var e = this;
            e.socket = io("/", {
                transports: ["websocket"],
                forceNew: !0
            }),
            e.notifications = [],
            e.notificationIdx = 0,
            e.isAuthenticated = !1,
            e.socket.on("connect", ()=>{
                console.log("connected to Chat"),
                e.connect()
            }
            ),
            e.socket.on("authenticated", e.onSocketAuthenticated.bind(e)),
            e.socket.on("autherror", e.onSocketAuthError.bind(e)),
            e.socket.on("notification", e.onNotification.bind(e)),
            e.notificationAlert = document.getElementById("notification-alert"),
            e.notificationTime = document.getElementById("notification-time"),
            e.notificationCategory = document.getElementById("notification-category"),
            e.notificationContent = document.getElementById("notification-content"),
            setInterval(e.update.bind(e), 1e3)
        }
        getCurrentUser() {
            if (window.hydra && window.hydra.data && window.hydra.data.user)
                return window.hydra.data.user
        }
        connect() {
            var e = this;
            (new hydra.HydraResource).fetch("/user/connect-io").then(t=>{
                e.socket.emit("authenticate", t.response)
            }
            ).catch(e=>{
                console.log("client error", e)
            }
            )
        }
        onSocketAuthenticated(e) {
            this.joinChannel(e.user._id, "user"),
            this.isAuthenticated = !0,
            document.dispatchEvent(new Event("hydra-socket-connected"))
        }
        onSocketAuthError(e) {
            console.log("socket authentication error", e)
        }
        joinChannel(e, t) {
            this.socket.emit("join", {
                channelType: t,
                channelId: e
            })
        }
        leaveChannel(e) {
            this.socket.emit("leave", {
                channelId: e
            })
        }
        onNotification(e) {
            this.notifications.push(e),
            this.notificationIdx = this.notifications.length - 1,
            this.updateNotificationDisplay()
        }
        createNotification(e) {
            this.notifications.push(e),
            this.notificationIdx = this.notifications.length - 1,
            this.updateNotificationDisplay()
        }
        previousNotification(e) {
            return e.preventDefault(),
            --this.notificationIdx < 0 && (this.notificationIdx = this.notifications.length - 1),
            this.updateNotificationDisplay(),
            !0
        }
        nextNotification(e) {
            return e.preventDefault(),
            ++this.notificationIdx >= this.notifications.length && (this.notificationIdx = 0),
            this.updateNotificationDisplay(),
            !0
        }
        closeNotification(e) {
            return e.preventDefault(),
            this.notificationAlert.classList.add("closed"),
            !0
        }
        updateNotificationDisplay() {
            var e = this.notifications[this.notificationIdx];
            this.notificationTime.setAttribute("timestamp", e.created),
            this.notificationTime.innerText = moment(e.created).fromNow(),
            this.notificationCategory.innerText = e.category,
            this.notificationContent.innerHTML = e.content,
            this.notificationAlert.classList.remove("closed")
        }
        update() {}
        showModal(e) {
            document.querySelector("#hydra-modal .modal-title").innerHTML = e.title,
            document.querySelector("#hydra-modal #modal-prompt").innerHTML = e.prompt;
            for (var t = document.querySelector("#hydra-modal .modal-footer"); t.firstChild; )
                t.removeChild(t.firstChild);
            e.buttons && e.buttons.length ? (t.classList.remove("d-none"),
            e.buttons.forEach(e=>{
                var o = document.createElement("button");
                o.setAttribute("type", "button"),
                e.onclick && (o.onclick = e.onclick),
                e.label && (o.innerHTML = e.label),
                o.classList.add("btn"),
                e.class && o.classList.add(e.class),
                t.appendChild(o)
            }
            )) : t.classList.add("d-none"),
            $("#hydra-modal").modal({
                show: !0
            })
        }
        closeModal() {
            $("#hydra-modal").modal("hide")
        }
        showLightbox(e) {
            var t = document.querySelector("#hydra-lightbox")
              , o = document.querySelector("#hydra-lightbox-image");
            t.classList.remove("d-none"),
            t.classList.add("d-flex"),
            o.src = e
        }
        hideLightbox() {
            var e = document.querySelector("#hydra-lightbox");
            e.classList.remove("d-flex"),
            e.classList.add("d-none")
        }
        loadHydraGraph(e, t) {
            return fetch(e, {
                json: !0
            }).then(e=>e.ok ? e.json() : Promise.reject(new Error("failed to load HYDRA graph"))).then(e=>{
                var o = t.getContext("2d");
                return Promise.resolve(new Chart(o,e.graph))
            }
            ).catch(e=>{
                console.error("HYDRA graph error", e)
            }
            )
        }
        resolveUser(e) {
            return fetch(`/user/resolve/${e}`).then(e=>e.json()).then(e=>e.success ? Promise.resolve(e.user) : Promise.reject(new Error(e.message)))
        }
    }
}();
hydra = window.hydra = window.hydra || {};
const INIT_ERROR_MSG = "HYDRA E2E is not properly configured. Please contact your system administrator for assistance.";
(()=>{
    hydra.HydraSecurityKeyPassword = class {
        constructor() {
            let e = this;
            if (e.currentTask = null,
            e.modal = document.getElementById("hydra-skp-input"),
            !e.modal)
                throw new Error("Security Key Password input component not found.");
            try {
                e.attachModal(),
                e.attachStrengthFeedback()
            } catch (e) {
                throw e
            }
        }
        attachModal() {
            if (this.passwordInputPrompt = this.modal.querySelector(".skp-input-prompt"),
            !this.passwordInputPrompt)
                throw new Error(INIT_ERROR_MSG);
            if (this.passwordInput = document.getElementById("skp-input"),
            !this.passwordInput)
                throw new Error(INIT_ERROR_MSG);
            if (this.savePasswordCheckbox = document.getElementById("skp-save-password"),
            !this.savePasswordCheckbox)
                throw new Error(INIT_ERROR_MSG);
            if (this.cancelButton = document.getElementById("skp-cancel-btn"),
            !this.cancelButton)
                throw new Error(INIT_ERROR_MSG);
            if (this.cancelButton.addEventListener("click", this.onModalCancel.bind(this)),
            this.acceptButton = document.getElementById("skp-accept-btn"),
            !this.acceptButton)
                throw new Error(INIT_ERROR_MSG);
            this.acceptButton.addEventListener("click", this.onModalAccept.bind(this))
        }
        attachStrengthFeedback() {
            let e, t = this;
            (e = document.getElementById("ecdh-key-password")) && e.addEventListener("input", t.updatePasswordFeedback.bind(t)),
            (e = document.getElementById("ecdh-regen-password")) && e.addEventListener("input", t.updatePasswordFeedback.bind(t)),
            t.skpInputFeedback = document.querySelectorAll(".skp-input-feedback") || [],
            t.skpInputWarning = document.querySelectorAll(".skp-input-feedback .skp-strength-warning") || [],
            t.skpInputStrength = document.querySelectorAll(".skp-input-feedback .skp-strength-indicator") || [],
            t.skpInputStrengthSuggestions = document.querySelectorAll(".skp-input-feedback .skp-strength-suggestions") || []
        }
        updatePasswordFeedback(e) {
            let t = zxcvbn(e.target.value);
            if (!t)
                return;
            let o = "5%"
              , r = "bg-danger";
            switch (t.score) {
            case 1:
                o = "25%";
                break;
            case 2:
                o = "50%",
                r = "bg-warning";
                break;
            case 3:
                o = "75%",
                r = "bg-success";
                break;
            case 4:
                o = "100%",
                r = "bg-success"
            }
            this.skpInputStrength.forEach(e=>{
                e.style.width = o,
                e.classList.remove("bg-danger"),
                e.classList.remove("bg-warning"),
                e.classList.remove("bg-success"),
                e.classList.add(r)
            }
            ),
            this.skpInputStrengthSuggestions.forEach(e=>{
                for (; e.firstChild; )
                    e.removeChild(e.firstChild);
                t.feedback.suggestions.forEach(t=>{
                    let o = document.createElement("small");
                    o.classList.add("form-text"),
                    o.classList.add("text-info"),
                    o.textContent = `> ${t}`,
                    e.appendChild(o)
                }
                )
            }
            ),
            this.skpInputWarning.forEach(e=>{
                t.feedback.warning && t.feedback.warning.length ? (e.textContent = t.feedback.warning,
                e.classList.remove("d-none")) : (e.textContent = "",
                e.classList.add("d-none"))
            }
            )
        }
        getSecurityKeyPassword() {
            let e = this
              , t = window.sessionStorage.password || window.localStorage.password;
            return t ? Promise.resolve({
                success: !0,
                isCancel: !1,
                skp: t
            }) : e.currentTask ? Promise.reject(new Error("Please resolve the current password request before starting another.")) : new Promise((t,o)=>{
                e.currentTask = {
                    resolve: t,
                    reject: o
                },
                $("#hydra-skp-input").modal({
                    show: !0,
                    keyboard: !1
                })
            }
            )
        }
        validateSecurityKeyPassword(e) {
            return zxcvbn(e)
        }
        onModalAccept(e) {
            if (e && e.preventDefault(),
            $("#hydra-skp-input").modal("hide"),
            !this.currentTask)
                return console.log("modal accept with no current task"),
                !0;
            let t = this.currentTask;
            this.currentTask = null;
            let o = this.passwordInput.value;
            return o && "string" == typeof o && o.length ? (t.resolve({
                success: !0,
                isCancel: !1,
                skp: o
            }),
            !0) : t.reject(new Error("No password entered."))
        }
        onModalCancel(e) {
            if (e && e.preventDefault(),
            $("#hydra-skp-input").modal("hide"),
            !this.currentTask)
                return console.log("modal cancel with no current task"),
                !0;
            let t = this.currentTask;
            return this.currentTask = null,
            t.reject(new Error("Security Key Password entry canceled.")),
            !0
        }
    }
}
)();
hydra = window.hydra = window.hydra || {};
const BOOTSTRAP_ALERT_CLASSES = ["alert-primary", "alert-secondary", "alert-success", "alert-danger", "alert-warning", "alert-info", "alert-light", "alert-dark"];
(()=>{
    hydra.HydraE2E = class {
        constructor() {
            this.b64 = new hydra.HydraBase64
        }
        initialize(e) {
            let t = this;
            return window.navigator.userAgent.match(/firefox/gi) ? t.showIncompatibleMessage("firefox") : (e = Object.assign({
                requireKeyUnlock: !1
            }, e),
            console.log("loading ECDH key pair..."),
            t.loadEcdhKeyPair(e).then(e=>e && e.success ? Promise.resolve(e.keyPair) : e && e.canceled ? Promise.reject(new Error("Password entry canceled. You will be unable to proceed until you unlock these keys or generate new ones.")) : t.fetchEcdhKeyPair()).then(e=>{
                e ? (t.showKeyManager(),
                t.privateKey = e.privateKey,
                t.publicKey = e.publicKey) : (console.log("user has no security keys"),
                document.dispatchEvent(new Event("hydra-chat-no-keys")),
                t.showKeyGenerator()),
                console.log("HydraE2E initialized", {
                    privateKey: t.privateKey ? "present" : "absent",
                    publicKey: t.publicKey ? "present" : "absent"
                })
            }
            ).catch(e=>{
                console.error("failed to load ECDH key pair", e),
                window.alert(e.message)
            }
            ))
        }
        showIncompatibleMessage(e) {
            document.getElementById("key-generator").classList.add("d-none"),
            document.getElementById("key-management").classList.add("d-none"),
            document.getElementById("about-key-password").classList.add("d-none"),
            document.getElementById(`incompatible-${e}`).classList.remove("d-none")
        }
        showKeyGenerator() {
            let e = document.getElementById("key-generator")
              , t = document.getElementById("key-management")
              , o = document.getElementById("about-key-password");
            e && e.classList.remove("d-none"),
            t && t.classList.add("d-none"),
            o && o.classList.add("d-none")
        }
        showKeyManager() {
            let e = document.getElementById("key-generator")
              , t = document.getElementById("key-management")
              , o = document.getElementById("about-key-password");
            e && e.classList.add("d-none"),
            t && t.classList.remove("d-none"),
            o && o.classList.remove("d-none")
        }
        generateEcdhKeyPair(e) {
            let t = this;
            e.preventDefault();
            let o = document.getElementById("key-generator")
              , r = document.getElementById("key-management")
              , a = document.getElementById("about-key-password")
              , s = document.getElementById("ecdh-key-password")
              , n = s.value;
            s.value = "";
            let i = hydra.skp.validateSecurityKeyPassword(n);
            if (console.log(i),
            i.score < 2)
                return window.alert("The password you entered is too insecure. Please try again."),
                s.focus(),
                !0;
            window.sessionStorage && (window.sessionStorage.password = n);
            let l = document.getElementById("ecdh-savepw");
            return l && l.checked ? (console.log("persisting skp to localStorage"),
            window.localStorage && (window.localStorage.password = n)) : (console.log("removing skp from localStorage"),
            window.localStorage && window.localStorage.removeItem("password")),
            o.classList.add("d-none"),
            t.createEcdhKeyPair(n).catch(e=>{
                console.error("generateEcdhKeyPair error", e),
                t.showAlert(e.message, "alert-danger")
            }
            ).finally(()=>{
                r.classList.remove("d-none"),
                a.classList.remove("d-none"),
                s.value = "",
                window.alert("Security Keys generated successfully."),
                window.location = "/chat/global"
            }
            ),
            !0
        }
        regenerateEcdhKeyPair(e) {
            let t = this;
            e.preventDefault(),
            document.getElementById("key-generator").classList.add("d-none");
            let o = document.getElementById("key-management");
            o.classList.add("d-none");
            let r = document.getElementById("about-key-password");
            r.classList.add("d-none");
            let a = document.getElementById("ecdh-regen-password")
              , s = a.value
              , n = hydra.skp.validateSecurityKeyPassword(s);
            if (console.log(n),
            n.score < 2)
                return window.alert("The password you entered is too insecure. Please try again."),
                a.focus(),
                !0;
            window.sessionStorage && (window.sessionStorage.password = s);
            let i = document.getElementById("ecdh-regen-savepw");
            return i && i.checked ? window.localStorage && (window.localStorage.password = s) : window.localStorage && window.localStorage.removeItem("password"),
            "string" != typeof s || s.length < 8 ? (window.alert("Password must be at least 8 characters long."),
            !0) : (t.createEcdhKeyPair(s).then(e=>{
                if (!e.success)
                    return Promise.reject(new Error(e.message))
            }
            ).catch(e=>{
                console.error("regenerateEcdhKeyPair error", e),
                t.showAlert(e.message, "alert-danger")
            }
            ).finally(()=>{
                o.classList.remove("d-none"),
                r.classList.remove("d-none"),
                a.value = ""
            }
            ),
            !0)
        }
        deleteEcdhKeyPair(e) {
            return e && e.preventDefault(),
            console.debug("removing ECDH key pair from Chat servers"),
            fetch("/user/ecdh-key-pair", {
                method: "DELETE"
            }).then(e=>{
                if (!e.ok)
                    return Promise.reject(new Error("Failed to remove keys from Gab Chat servers. Please try again later."));
                window.localStorage && (window.localStorage.removeItem("privateKey"),
                window.localStorage.removeItem("publicKey"),
                window.localStorage.removeItem("password"))
            }
            ).catch(e=>{
                console.error("deleteEcdhKeyPair error", e),
                window.alert(e.message)
            }
            )
        }
        createEcdhKeyPair(e) {
            let t = this;
            return t.showAlert("Generating encryption keys..."),
            console.debug("generating new security key pair"),
            window.crypto.subtle.generateKey({
                name: "ECDH",
                namedCurve: "P-256"
            }, !0, ["deriveKey", "deriveBits"]).then(o=>(t.privateKey = o.privateKey,
            t.publicKey = o.publicKey,
            t.showAlert("Storing encryption keys..."),
            t.storeEcdhKeyPair(e))).then(e=>(t.closeAlert(),
            e))
        }
        storeEcdhKeyPair(e) {
            let t = this
              , o = {};
            return t.wrapKey(t.privateKey, e).then(e=>(o.privateKey = e,
            window.localStorage && (window.localStorage.privateKey = JSON.stringify(e)),
            window.crypto.subtle.exportKey("jwk", t.publicKey))).then(e=>(o.publicKey = e,
            window.localStorage && (window.localStorage.publicKey = JSON.stringify(e)),
            fetch("/user/ecdh-key-pair", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(o)
            }))).then(e=>e.json()).then(e=>(window.localStorage.keyVersion = e.keyPair.__v.toString(),
            console.log("storeEcdhKeyPair", e),
            Promise.resolve(e)))
        }
        loadEcdhKeyPair(e) {
            if (!window.localStorage)
                return Promise.reject(new Error("Your browser does not support local storage. Browser local storage is required to use Gab Chat."));
            if (!window.localStorage.publicKey || !window.localStorage.privateKey)
                return Promise.resolve(null);
            let t = JSON.parse(window.localStorage.publicKey)
              , o = JSON.parse(window.localStorage.privateKey);
            return o.data = this.b64.decode(o.data),
            o.salt = this.b64.decode(o.salt),
            o.iv = this.b64.decode(o.iv),
            this.unlockEcdhKeyPair(t, o, e)
        }
        unlockEcdhKeyPair(e, t, o) {
            var r = this;
            return o = Object.assign({
                requireKeyUnlock: !1
            }, o),
            hydra.skp.getSecurityKeyPassword().then(o=>r.importEcdhKeyPair(e, t, o.skp).then(e=>(window.sessionStorage && (console.log("persisting SKP to browser session storage"),
            window.sessionStorage.password = o.skp),
            window.localStorage && hydra.skp.savePasswordCheckbox.checked && (console.log("persisting SKP to brower local storage"),
            window.localStorage.password = o.skp),
            Promise.resolve({
                success: !0,
                canceled: !1,
                keyPair: e
            }))).catch(o=>"OperationError" === o.name ? (window.alert("The password entered failed to unlock your private key. Please try again."),
            r.unlockEcdhKeyPair(e, t)) : Promise.resolve({
                success: !1,
                canceled: !1,
                error: o
            }))).catch(a=>o.requireKeyUnlock ? (window.alert("You must unlock your private key before continuing."),
            r.unlockEcdhKeyPair(e, t, o)) : Promise.resolve({
                success: !1,
                canceled: !0,
                error: a
            }))
        }
        fetchEcdhKeyPair() {
            let e = this;
            return console.log("fetching security keys from Chat servers"),
            fetch("/user/ecdh-key-pair", {
                json: !0
            }).then(e=>e.json()).then(t=>t.success ? e.storeAndImportFetchedKeyPair(t) : 404 === t.error.status ? Promise.resolve() : Promise.reject(new Error(t.message)))
        }
        storeAndImportFetchedKeyPair(e) {
            var t = this;
            return console.log("persisting security keys to local storage", {
                response: e
            }),
            window.localStorage.keyVersion = e.keyPair.__v.toString(),
            window.localStorage.privateKey = JSON.stringify(e.keyPair.data.privateKey),
            window.localStorage.publicKey = JSON.stringify(e.keyPair.data.publicKey),
            e.keyPair.data.privateKey.data = t.b64.decode(e.keyPair.data.privateKey.data),
            e.keyPair.data.privateKey.salt = t.b64.decode(e.keyPair.data.privateKey.salt),
            e.keyPair.data.privateKey.iv = t.b64.decode(e.keyPair.data.privateKey.iv),
            hydra.skp.getSecurityKeyPassword().then(o=>t.importEcdhKeyPair(e.keyPair.data.publicKey, e.keyPair.data.privateKey, o.skp).then(e=>(window.sessionStorage && (console.log("persisting SKP to browser session storage"),
            window.sessionStorage.password = o.skp),
            window.localStorage && hydra.skp.savePasswordCheckbox.checked && (console.log("persisting SKP to brower local storage"),
            window.localStorage.password = o.skp),
            Promise.resolve(e))))
        }
        importEcdhKeyPair(e, t, o) {
            let r = this
              , a = {};
            return e ? t ? o ? window.crypto.subtle.importKey("jwk", e, {
                name: "ECDH",
                namedCurve: "P-256"
            }, !0, e.key_ops).then(e=>(a.publicKey = e,
            r.unwrapKey(t, o))).then(e=>(a.privateKey = e,
            Promise.resolve(a))) : Promise.reject(new Error("You must provide your Security Key Password to un-lock your security keys for use with Gab Chat.")) : Promise.reject(new Error("Missing private key data. Please re-generate your security keys.")) : Promise.reject(new Error("Missing public key data. Please re-generate your security keys."))
        }
        deleteLocalKeyStorage() {
            window.localStorage.removeItem("publicKey"),
            window.localStorage.removeItem("privateKey")
        }
        deriveKey(e) {
            let t = {};
            return window.crypto.subtle.deriveBits({
                name: "ECDH",
                public: e
            }, this.privateKey, 256).then(e=>(t.sharedDS = e.slice(0, 16),
            window.crypto.subtle.importKey("raw", e.slice(16, 32), "PBKDF2", !1, ["deriveKey"]))).then(e=>(t.sharedDK = e,
            window.crypto.subtle.deriveKey({
                name: "PBKDF2",
                salt: t.sharedDS,
                iterations: 1e5,
                hash: "SHA-256"
            }, t.sharedDK, {
                name: "AES-GCM",
                length: 256
            }, !0, ["encrypt", "decrypt"])))
        }
        getKeyMaterial(e) {
            const t = new TextEncoder;
            return window.crypto.subtle.importKey("raw", t.encode(e), {
                name: "PBKDF2"
            }, !1, ["deriveBits", "deriveKey"])
        }
        getKey(e, t) {
            return window.crypto.subtle.deriveKey({
                name: "PBKDF2",
                salt: t,
                iterations: 1e5,
                hash: "SHA-256"
            }, e, {
                name: "AES-GCM",
                length: 256
            }, !0, ["wrapKey", "unwrapKey"])
        }
        wrapKey(e, t) {
            let o = this
              , r = {};
            return console.debug("wrapping security key for transmission or storage"),
            o.getKeyMaterial(t).then(e=>(r.salt = window.crypto.getRandomValues(new Uint8Array(16)),
            o.getKey(e, r.salt))).then(t=>(r.iv = window.crypto.getRandomValues(new Uint8Array(16)),
            window.crypto.subtle.wrapKey("jwk", e, t, {
                name: "AES-GCM",
                iv: r.iv
            }))).then(e=>(r.data = o.b64.encode(e),
            r.iv = o.b64.encode(r.iv),
            r.salt = o.b64.encode(r.salt),
            Promise.resolve(r))).catch(e=>(console.error("wrapKey error", e),
            Promise.reject(e)))
        }
        unwrapKey(e, t) {
            let o = this
              , r = {};
            return console.debug("unwrapping security key from storage or network"),
            o.getKeyMaterial(t).then(t=>(r.keyMaterial = t,
            o.getKey(t, e.salt))).then(t=>window.crypto.subtle.unwrapKey("jwk", e.data, t, {
                name: "AES-GCM",
                iv: e.iv
            }, {
                name: "ECDH",
                namedCurve: "P-256",
                hash: {
                    name: "SHA-256"
                }
            }, !0, ["deriveKey", "deriveBits"])).catch(e=>(console.error("unwrapKey error", e),
            Promise.reject(e)))
        }
        showAlert(e, t="alert-secondary") {
            let o = document.getElementById("key-alert");
            BOOTSTRAP_ALERT_CLASSES.forEach(e=>{
                o.classList.remove(e)
            }
            ),
            o.classList.add(t),
            o.classList.remove("d-none"),
            document.getElementById("key-alert-message").textContent = e
        }
        closeAlert() {
            let e = document.getElementById("key-alert");
            BOOTSTRAP_ALERT_CLASSES.forEach(t=>{
                e.classList.remove(t)
            }
            ),
            e.classList.add("d-none")
        }
        importRoomMember(e) {
            var t = this;
            return window.crypto.subtle.importKey("jwk", e.publicKey, {
                name: "ECDH",
                namedCurve: "P-256"
            }, !0, e.publicKey.key_ops).then(o=>(e.publicKey = o,
            t.deriveKey(e.publicKey))).then(t=>(e.secretKey = t,
            window.crypto.subtle.exportKey("jwk", t))).then(t=>(e.secretKeyData = t,
            Promise.resolve(e)))
        }
        onJoinChatRoom(e) {
            let t = this
              , o = [];
            return console.log("checking security key version", window.localStorage.keyVersion),
            fetch(`/user/ecdh-key-pair/version?v=${window.localStorage.keyVersion}`).then(e=>e.json()).then(e=>e.success ? e.keyPair ? t.storeAndImportFetchedKeyPair(e) : Promise.resolve() : Promise.reject(new Error(e.message))).then(()=>(e.members.forEach(e=>{
                e.publicKey ? o.push(t.importRoomMember(e)) : console.log(`Room member ${e.username} does not have a public key.`)
            }
            ),
            Promise.all(o)))
        }
        encryptToChatRoom(e, t) {
            let o = this
              , r = []
              , a = [];
            return e.members.forEach(e=>{
                e.publicKey ? a.push(o.encryptContent(e, t).then(t=>{
                    r.push({
                        recipient: e._id,
                        payload: t
                    })
                }
                ).catch(e=>{
                    throw console.error("encryptToChatRoom error", e),
                    e
                }
                )) : console.log(`room member ${e.username} does not have a public key.`)
            }
            ),
            Promise.all(a).then(()=>Promise.resolve(r))
        }
        encryptContent(e, t) {
            let o = this
              , r = [];
            return e && e.publicKey ? (e.secretKey || r.push(o.deriveKey(e.publicKey).then(t=>(e.secretKey = t,
            window.crypto.subtle.exportKey("jwk", t))).then(t=>{
                e.secretKeyData = t
            }
            )),
            Promise.all(r).then(()=>{
                let r = window.crypto.getRandomValues(new Uint8Array(12))
                  , a = (new TextEncoder).encode(t);
                return console.log("encrypt to user", {
                    user: e.username,
                    secretKey: e.secretKeyData
                }),
                window.crypto.subtle.encrypt({
                    name: "AES-GCM",
                    iv: r
                }, e.secretKey, a).then(e=>{
                    let t = o.b64.encode(e);
                    return Promise.resolve({
                        iv: o.b64.encode(r),
                        encrypted: t
                    })
                }
                )
            }
            )) : Promise.reject(new Error(`Room member ${e.username} does not have a public key.`))
        }
        decryptMessage(e, t) {
            let o = this
              , r = t.getAttribute("data-sender-id")
              , a = e.members.find(e=>e._id.toString() === r);
            if (!a)
                return Promise.reject(new Error("Room member does not exist"));
            if (!a.publicKey)
                return Promise.reject(new Error(`Room member ${a.username} does not have a public key.`));
            let s = [];
            return a.secretKey || s.push(o.deriveKey(a.publicKey).then(e=>(a.secretKey = e,
            window.crypto.subtle.exportKey("jwk", e))).then(e=>{
                a.secretKeyData = e
            }
            )),
            Promise.all(s).then(()=>{
                let e = o.b64.decode(t.getAttribute("data-iv"))
                  , r = o.b64.decode(t.textContent);
                return window.crypto.subtle.decrypt({
                    name: "AES-GCM",
                    iv: e
                }, a.secretKey, r)
            }
            ).then(e=>{
                let o = (new TextDecoder).decode(e);
                t.textContent = o,
                t.setAttribute("data-is-decrypted", !0)
            }
            ).catch(e=>(console.error("decryptMessage error", e),
            t.innerHTML = '<span class="message__content__text-muted">Message failed to decrypt. The author may have invalidated or re-generated their security keys.</span>',
            Promise.reject(e)))
        }
    }
}
)();
hydra = window.hydra = window.hydra || {};
!function() {
    hydra.HydraNotifications = class {
        constructor() {
            var e = this;
            e.favicon = document.querySelector('link[rel*="icon"]'),
            e.documentTitle = document.title,
            e.activityNotifications = 0,
            "Notification"in window ? (window.localStorage.notificationSettings || (window.localStorage.notificationSettings = JSON.stringify({
                enabled: !0,
                sound: !0,
                vibrate: !0
            })),
            e.settings = JSON.parse(window.localStorage.notificationSettings),
            hydra.audio.load("chat-notification.ribbit"),
            e.isWindowActive = !0,
            window.addEventListener("focus", ()=>{
                console.log("window is active"),
                e.isWindowActive = !0,
                e.clearActivityNotification()
            }
            ),
            window.addEventListener("blur", ()=>{
                console.log("window is inactive"),
                e.isWindowActive = !1
            }
            ),
            e.supported = !0,
            e.enabled = "granted" === Notification.permission,
            console.log("HydraNotifications", {
                supported: e.supported,
                enabled: e.enabled
            }),
            e.enabled || e.requestPermission()) : e.supported = !1
        }
        requestPermission() {
            var e = this;
            return "granted" === Notification.permission ? Promise.resolve(!0) : "denied" === Notification.permission ? Promise.reject(new Error("Notification permissions have been denied.")) : Notification.requestPermission().then(t=>{
                e.enabled = "granted" === t
            }
            )
        }
        showNotification(e, t) {
            if (this.supported && this.enabled && this.settings.enabled && !this.isWindowActive) {
                var o = t || e.title || "Chat Notification"
                  , r = new Notification(o,{
                    dir: e.dir,
                    lang: e.lang,
                    icon: e.icon,
                    image: e.image,
                    badge: e.badge,
                    body: e.body,
                    renotify: e.renotify,
                    requireInteraction: e.requireInteraction,
                    actions: e.actions,
                    silent: e.silent,
                    data: e.data,
                    vibrate: this.settings.vibrate
                });
                r.addEventListener("click", ()=>{
                    console.log("notification clicked", r)
                }
                ),
                r.addEventListener("error", e=>{
                    console.log("notification error", r, e)
                }
                )
            }
        }
        clearActivityNotification() {
            this.favicon && this.favicon.setAttribute("href", "/img/favicon/default.png"),
            this.activityNotifications = 0,
            document.title = this.documentTitle
        }
        indicateActivity() {
            this.isWindowActive || (this.activityNotifications += 1,
            document.title = `(${this.activityNotifications}) ${this.documentTitle}`,
            this.favicon && this.favicon.setAttribute("href", "/img/favicon/active.png"))
        }
    }
}(),
function() {
    (window.hydra = window.hydra || {}).HydraResource = class {
        constructor(e, t) {
            this.name = e || "Resource",
            t = t || {},
            this.options = Object.assign({
                async: !0,
                type: "json"
            }, t)
        }
        fetch(e, t) {
            var o = this
              , r = {
                params: {
                    method: "GET",
                    url: e,
                    params: t
                }
            };
            return new Promise(function(e, t) {
                r.request = new XMLHttpRequest,
                r.resolve = e,
                r.reject = t,
                o.executeTransaction(r)
            }
            )
        }
        post(e, t, o) {
            var r, a = {
                params: {
                    method: "POST",
                    url: e,
                    body: t,
                    bodyContentType: o || "application/json"
                }
            };
            try {
                r = new Promise(this.doPost.bind(this, a))
            } catch (e) {
                throw console.error("hydra-resource.post error", e),
                e
            }
            return r
        }
        doPost(e, t, o) {
            var r;
            if (this.options.type)
                switch (this.options.type) {
                case "json":
                case "html":
                    e.params.body = JSON.stringify(e.params.body);
                    break;
                default:
                    throw r = new Error("invalid resource type specified",{
                        type: this.options.type
                    }),
                    console.error(r.message, {
                        error: r
                    }),
                    r
                }
            e.request = new XMLHttpRequest,
            e.resolve = t,
            e.reject = o,
            this.executeTransaction(e)
        }
        put(e, t, o) {
            var r, a = {
                params: {
                    method: "PUT",
                    url: e,
                    body: t,
                    bodyContentType: o || "application/json"
                }
            };
            try {
                r = new Promise(this.doPut.bind(this, a))
            } catch (e) {
                throw console.error("dmp-resource.put error", e),
                e
            }
            return r
        }
        doPut(e, t, o) {
            var r;
            if (this.options.type)
                switch (this.options.type) {
                case "json":
                    e.params.body = JSON.stringify(e.params.body);
                    break;
                default:
                    throw r = new Error("invalid resource type specified",{
                        type: this.options.type
                    }),
                    console.error(r.message, {
                        error: r
                    }),
                    r
                }
            e.request = new XMLHttpRequest,
            e.resolve = t,
            e.reject = o,
            this.executeTransaction(e)
        }
        del(e) {
            var t, o = {
                params: {
                    method: "DELETE",
                    url: e
                }
            };
            try {
                t = new Promise(this.doDelete.bind(this, o))
            } catch (e) {
                throw console.error("hydra-resource.post error", e),
                e
            }
            return t
        }
        doDelete(e, t, o) {
            if (e.request = new XMLHttpRequest,
            e.resolve = t,
            e.reject = o,
            e.request.open(e.params.method, e.params.url, !0),
            this.options.type)
                switch (this.options.type) {
                case "json":
                    e.params.body = JSON.stringify(e.params.body);
                    break;
                default:
                    return console.error("invalid resource type specified:", this.options.type),
                    e.request.abort(),
                    void delete e.request
                }
            else
                e.params.body = JSON.stringify(e.params.body);
            this.executeTransaction(e)
        }
        buildTransactionUrl(e) {
            var t = e.params.url
              , o = "?";
            if (!e.params.params)
                return t;
            for (var r in e.params.params)
                e.params.params.hasOwnProperty(r) && (t += o,
                t += r.toString(),
                t += "=",
                t += e.params.params[r].toString(),
                o = "&");
            return t
        }
        executeTransaction(e) {
            var t = this.onReadyStateChange.bind(this, e);
            e.request.addEventListener("readystatechange", t),
            e.requestUrl = this.buildTransactionUrl(e),
            e.request.open(e.params.method, e.requestUrl, !0),
            e.params.bodyContentType && e.request.setRequestHeader("Content-Type", e.params.bodyContentType),
            e.request.send(e.params.body)
        }
        onReadyStateChange(e) {
            var t;
            if (e.request.readyState === XMLHttpRequest.DONE)
                if (200 === e.request.status)
                    t = "json" === this.options.type ? JSON.parse(e.request.response) : e.request.response,
                    e.resolve({
                        url: e.params.url,
                        status: e.request.status,
                        statusText: e.request.statusText,
                        response: t
                    });
                else {
                    var o;
                    try {
                        o = JSON.parse(e.request.response)
                    } catch (t) {
                        console.log("response error", {
                            error: e.request.response
                        })
                    }
                    e.reject({
                        status: e.request.status,
                        statusText: e.request.statusText,
                        response: o
                    })
                }
        }
    }
}(),
function() {
    (window.hydra = window.hydra || {}).Spotlight = class {
        constructor() {
            let e = this;
            window.addEventListener("storage", t=>{
                console.log("Spotlight storage changed", t),
                e.load()
            }
            ),
            e.load()
        }
        load() {
            let e = this;
            if (e.spotlight = localStorage.getItem("spotlight"),
            e.spotlight)
                return e.spotlight = JSON.parse(e.spotlight),
                void console.log("spotlight", e.spotlight);
            e.spotlight = {},
            e.commit()
        }
        commit() {
            localStorage.setItem("spotlight", JSON.stringify(this.spotlight || {}))
        }
        addUser(e) {
            this.spotlight.push(e),
            this.commit()
        }
        removeUser(e) {
            let t = this.spotlight.indexOf(e);
            -1 !== t && (this.spotlight = this.spotlight.splice(t, 1),
            this.commit())
        }
        clear() {
            this.spotlight = {},
            this.commit()
        }
    }
}();
