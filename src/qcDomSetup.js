import EventedRef from './EventedRef.js';
import qcFetchJsonFromQs from './qcFetchJsonFromQs.js';
import qcYtSearchInput from './qcYtSearchInput.js';
import QcYtSearchQuery from './QcYtSearchQuery.js';

const YtResults = EventedRef(null);

document.body.append((() => {

    const header = document.createElement('header');

    header.append((() => {

        const tabBar = document.createElement('nav');

        const Button = (tab, tabName) => {
            
            const button = document.createElement('button');

            button.append(tabName);

            return button;
        
        };

        tabBar.append(Button('queue', 'Queue'));

        tabBar.append(Button('recents', 'Recents'));
        
        tabBar.append(Button('yt', 'YouTube'));

        return tabBar;
    
    })());

    header.append((() => {
    
        const searchBar = document.createElement('div');

        const YtSearchSubmission = EventedRef(undefined);

        searchBar.append((() => {
        
            const form = document.createElement('form');

            form.action = '';

            form.addEventListener('submit', async (event) => {
            
                event.preventDefault();

                // qcYtSearchInput.blur();

                if (QcYtSearchQuery() === '') {
                
                    YtSearchSubmission.set(undefined);

                    YtResults.set(null);

                }
                else {

                    const submission = {};

                    YtSearchSubmission.set(submission);

                    const results = await qcFetchJsonFromQs(`/ytSearchResults?${new URLSearchParams({query: QcYtSearchQuery()})}`);

                    if (submission === YtSearchSubmission()) {

                        YtSearchSubmission.set(undefined);
                    
                        if (results === null) {
                        
                            alert('${errorMessage}');
                        
                        }
                        else if (results === undefined) {
                        
                            alert('${errorMessage}');
                        
                        }
                        else {
                        
                            YtResults.set(results);
                        
                        }
                    
                    }
                
                }
                
            });

            form.append(qcYtSearchInput);

            return form;
        
        })());

        searchBar.append((() => {

            const button = document.createElement('button');

            button.addEventListener('click', () => {

                if (YtSearchSubmission() === undefined) {
                
                    QcYtSearchQuery.set('');

                    qcYtSearchInput.focus();    
                
                }
                else {
                
                    YtSearchSubmission.set(undefined);
                
                }

            });

            const updateIcon = () => {

                button.replaceChildren(YtSearchSubmission() === undefined? '❌' : '⌛');
            
            };

            updateIcon();

            YtSearchSubmission.changeHandlers.push(updateIcon);

            const updateVisibility = () => {

                button.style.display = YtSearchSubmission() === undefined? (QcYtSearchQuery() === ''? 'none' : '') : '';    
            
            };

            updateVisibility();

            YtSearchSubmission.changeHandlers.push(updateVisibility);

            QcYtSearchQuery.changeHandlers.push(updateVisibility);
        
            return button;
        
        })());

        return searchBar;

    })());

    header.append((() => {
    
        const logoButton = document.createElement('button');

        logoButton.append('💿');

        return logoButton;
    
    })());

    return header;    

})());

document.body.append((() => {

    const main = document.createElement('main');

    const updateChildren = () => {

        if (YtResults() === null) {
        
            main.replaceChildren('${welcomeMessage}');            
        
        }
        else if (YtResults().length === 0) {
        
            main.replaceChildren('${noResultsMessage}');
        
        }
        else {
        
            main.replaceChildren((() => {
            
                const ul = document.createElement('ul');

                const ResultLi = (result) => {
                                    
                    const li = document.createElement('li');

                    const canBeExpanded = true;

                    const ChildResults = EventedRef(result.kind === 'list'? result.value : null);

                    const IsExpanded = EventedRef(false);

                    if (canBeExpanded) {
                    
                        li.append((() => {
                            
                            const expandButton = document.createElement('button');

                            const Expansion = EventedRef(undefined);

                            expandButton.addEventListener('click', async () => {

                                if (Expansion() === undefined) {
                                
                                    if (ChildResults() === null) {
                                                                    
                                        const expansion = {};

                                        Expansion.set(expansion);

                                        const childResults = await (() => {
                                        
                                            if (result.kind === 'channel') {
                                            
                                                return qcFetchJsonFromQs(`/ytChannelResults?${new URLSearchParams({channel: result.value, channelTitle: result.title})}`);
                                            
                                            }

                                            if (result.kind === 'playlist') {
                                            
                                                return qcFetchJsonFromQs(`/ytPlaylistVideoResults?${new URLSearchParams({playlist: result.value})}`);
                                            
                                            }

                                            if (result.kind === 'video') {
                                            
                                                return qcFetchJsonFromQs(`/ytVideoRelatedResults?${new URLSearchParams({video: result.value.video})}`);
                                            
                                            }

                                            return [];
                                        
                                        })();

                                        if (expansion === Expansion()) {
                                        
                                            Expansion.set(undefined);

                                            if (childResults === null) {
                                            
                                                alert('${errorMessage}');                                            
                                            
                                            }
                                            else if (childResults === undefined) {
                                            
                                                alert('${errorMessage}');
                                            
                                            }
                                            else {
                                            
                                                if (ChildResults() === null) {
                                                
                                                    ChildResults.set(childResults);
                                                
                                                }

                                                IsExpanded.set(true);
                                            
                                            }
                                        
                                        }
                                    
                                    }
                                    else {
                                    
                                        IsExpanded.set(!IsExpanded());
                                    
                                    }
                                
                                }
                                else {
                                
                                    Expansion.set(undefined);
                                
                                }
                                
                            });

                            const updateIcon = () => {
                            
                                expandButton.replaceChildren(Expansion() === undefined? (IsExpanded()? '➖' : (result.kind === 'video'? '🍆' : '➕')) : '⌛');
                            
                            };

                            updateIcon();

                            Expansion.changeHandlers.push(updateIcon);

                            IsExpanded.changeHandlers.push(updateIcon);

                            return expandButton;
                        
                        })());
                    
                    }

                    li.append((() => {
                    
                        const contextButton = document.createElement('button');

                        contextButton.append(result.title);

                        if (result.subtitle !== '') {
                        
                            contextButton.append(' ');

                            contextButton.append((() => {
                            
                                const span = document.createElement('span');

                                span.append(`(${result.subtitle})`);

                                span.classList.add('nameSubtitle');

                                return span;
                            
                            })());                            
                        
                        }

                        return contextButton;
                    
                    })());

                    li.append((() => {
                    
                        const bumpDownButton = document.createElement('button');

                        bumpDownButton.append('⬇️');

                        bumpDownButton.style.display = 'none';

                        return bumpDownButton;
                    
                    })());

                    li.append((() => {
                    
                        const bumpUpButton = document.createElement('button');

                        bumpUpButton.append('⬆️');

                        return bumpUpButton;
                    
                    })());

                    li.append((() => {
                    
                        const childResultsUl = document.createElement('ul');

                        const updateChildren = () => {

                            if (ChildResults() === null) {
                            
                                childResultsUl.replaceChildren();
                            
                            }
                            else {
                            
                                childResultsUl.replaceChildren(...ChildResults().map(ResultLi));
                            
                            }
                        
                        };

                        updateChildren();

                        ChildResults.changeHandlers.push(updateChildren);

                        const updateVisibility = () => {
                        
                            childResultsUl.style.display = IsExpanded()? '' : 'none';
                        
                        };

                        updateVisibility();

                        IsExpanded.changeHandlers.push(updateVisibility);

                        return childResultsUl;

                    })());

                    return li;
                
                };

                ul.append(...YtResults().map(ResultLi));

                return ul;
            
            })());            
        
        }
    
    };

    updateChildren();

    YtResults.changeHandlers.push(updateChildren);

    return main;    

})());
