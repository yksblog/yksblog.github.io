/**
 * Judege whether `args` in current page.
 * @param {Array | String} args - Pages array or page string.
 */
export function isCurPage(args) {
    if (typeof args === 'string') {
        if (
            [
                '/orgs/' + args + '.html',
                '/orgs/' + args,
                '/' + args + '.html',
                '/' + args
            ].includes(location.pathname)
        ) return true;
    } else if (args instanceof Array) {
        let _res = 0;
        args.map((item) => {
            if (
                [
                    '/orgs/' + item + '.html',
                    '/orgs' + item,
                    '/' + item + '.html',
                    '/' + item,
                    // -- ovirgo.com --
                    '/blog/' + item + '.html',
                    '/blog/' + item
                ].includes(location.pathname)
            ) _res += 1;
        });

        if (_res > 0) return true;
    }
}

/**
 * Diff device type.
 */
export function browserRedirect() {
    let sUserAgent = navigator.userAgent.toLowerCase(),
        bIsIpad = sUserAgent.match(/ipad/i) == 'ipad',
        bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os',
        bIsMidp = sUserAgent.match(/midp/i) == 'midp',
        bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4',
        bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb',
        bIsAndroid = sUserAgent.match(/android/i) == 'android',
        bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce',
        bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile';

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return 'MB';
    } else {
        return 'PC';
    }
}

/**
 * Beautify item like `Idea`,
 * and you can Activate/Deactivate global card style.
 * @param { Array } cardPages Card pages
 * @param { Boolean } isAllCardStyle Active global site card style
 */
export function initCardPages(cardPages, isAllCardStyle = false) {
    if (isAllCardStyle) {
        $('.outline-2').each(function () { $(this).addClass('js-outline-2') });
        $('.outline-3').each(function () { $(this).addClass('js-outline-3') });
        return;
    }

    if (isCurPage(cardPages)) {
        $('.outline-2').each(function () { $(this).addClass('js-outline-2') });
        $('.outline-3').each(function () { $(this).addClass('js-outline-3') });
    }
}

/**
 * To encrypted your pages.
 * @param {Array} encryptedPages - Encrypted pages
 * @param {String} password - Password
 */
export function initEncryptedPages(encryptedPages, password) {

    if (isCurPage(encryptedPages)) {
        if (sessionStorage.getItem('f2f0c89f0c89')) {
            console.log('Welcome, Sir.');
        } else {
            $('body').addClass('body-fuzzy')
            $('body').append(`
                <div class='body-mask'>
                    <div class="body-mask--password">
                        <div style="display: inline-block; width: 20px;">div</div>
                        <input id="pw" type="password" placeholder="password" />
                        <div id="tip" style="visibility: hidden; color: #900;">tip</div>
                    </div>
                </div>
            `)

            $('#pw').keypress(function (event) {
                let _password = $(this).val();
                if (event.keyCode == '13') {
                    console.log(_password);
                    if (_password === password) {
                        $('.body-mask').remove()
                        sessionStorage.setItem('f2f0c89f0c89', true);
                    } else {
                        $('#pw').val('');
                        $('#tip').css({ visibility: 'visible' })
                    }
                }
            })
        }
    }
}

/**
 * Active mouse animate.
 */
export function initMouseClickAnimate() {
    $(document).click((e) => {
        let size = 120; // size of water block
        $('body').append(`<div class='water-animate'></div>`); // create a water block

        $('.water-animate')
            .css({
                // init style
                position: 'fixed',
                left: e.clientX,
                top: e.clientY,
                borderRadius: size + 'px',
                border: '2px solid #19f',
                'z-index': -1,
            })
            .stop() // to stop non-end previous animate
            .animate(
                {
                    width: size,
                    height: size,
                    left: e.clientX - size / 2,
                    top: e.clientY - size / 2,
                    opacity: '0',
                },
                'slow',
                () => $('body .water-animate').remove()
            );
    });
}

/**
 * Zoom images.
 */
export function initImageZoom() {
    let isZoom = false;

    $('img').each(function (idx, ele) {
        $(this).click(function () {
            if (!isZoom) {
                $('html').append(
                    `<div class='img-wrapper'>
                        <img class='img-zoom' src=${ele.src} />
                    </div>`
                );

                $('.img-wrapper').click(function () {
                    $('.img-wrapper').remove();
                    isZoom = false;
                });

                isZoom = true;
            }
        });
    });
}

/**
 * Update cent of element's innerHHTML when page scroll
 * @param { Object } ele - DOM element
 */
export function scrollToTop(ele) {
    // console.log('-------');
    let totalH = $(document).height();      // page height
    let clientH = $(window).height();       // view height
    let scrollH = $(document).scrollTop();  // scroll height

    let _cent = parseInt((scrollH / (totalH - clientH)) * 100);
    _cent = ('' + _cent).length < 2 ? '0' + _cent : _cent;
    ele.innerHTML = _cent + '%TOP↑';
}

/**
 * Debounce & Throttle
 */
export function debounce(fn, delay) {
    let timer;
    return function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(fn, delay);
    }
}

export function throttle(fn, delay) {
    let valid = true;

    return function () {
        if (!valid) return false;

        valid = false;
        setTimeout(() => {
            fn();
            valid = true;
        }, delay);
    }
}

/**
 * Better localStorage which can remember the data type.
 */
export const betterLocalStorage = {
    get(key) {
        if (!localStorage.getItem(key)) return;

        let [type, val] = localStorage.getItem(key).split('_');
        if (type === 'str') return val;
        if (type === 'bol') return Boolean(val);
        if (type === 'obj') return JSON.parse(val);
    },
    set(key, val) {
        if (typeof val === 'string') {
            localStorage.setItem(key, 'str_' + val);
            return;
        }
        if (typeof val === 'boolean') {
            localStorage.setItem(key, 'bol_' + val);
            return;
        }
        if (typeof val === 'object') {
            localStorage.setItem(key, 'obj_' + JSON.stringify(val));
            return;
        }
    },
    del(key) {
        localStorage.removeItem(key);
    },
};

/**
  * 初始化挂灯笼信息
  */
export function initHtmlxnkllantern(){
    // 只能有四个字,因为只有4个灯笼
    const xnkl = "欢度国庆";

    $(`<div class="xnkl">
  <div class="deng-box2">
    <div class="deng">
      <div class="xian"></div>
      <div class="deng-a">
        <div class="deng-b">
          <div class="deng-t">${xnkl[1]}</div>
        </div>
      </div>
      <div class="shui shui-a">
        <div class="shui-c"></div>
        <div class="shui-b"></div>
      </div>
    </div>
  </div>
  <div class="deng-box3">
    <div class="deng">
      <div class="xian"></div>
      <div class="deng-a">
        <div class="deng-b">
          <div class="deng-t">${xnkl[0]}</div>
        </div>
      </div>
      <div class="shui shui-a">
        <div class="shui-c"></div>
        <div class="shui-b"></div>
      </div>
    </div>
  </div>
  <div class="deng-box1">
    <div class="deng">
      <div class="xian"></div>
      <div class="deng-a">
        <div class="deng-b">
          <div class="deng-t">${xnkl[3]}</div>
        </div>
      </div>
      <div class="shui shui-a">
        <div class="shui-c"></div>
        <div class="shui-b"></div>
      </div>
    </div>
  </div>
  <div class="deng-box">
    <div class="deng">
      <div class="xian"></div>
      <div class="deng-a">
        <div class="deng-b">
          <div class="deng-t">
${xnkl[2]}</div>
        </div>
      </div>
      <div class="shui shui-a">
        <div class="shui-c"></div>
        <div class="shui-b"></div>
      </div>
    </div>
  </div>
</div>
`).insertBefore('.content');
}
