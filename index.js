export function install(editor) {
    editor.view.container.focus();

    editor.on('keydown', e => {
        switch (e.code) {
        case 'Delete':
            editor.selected.each(n => editor.removeNode(n));
            break;
        case 'Space':
            let rect = editor.view.container.getBoundingClientRect();
            let event = new MouseEvent('contextmenu', {
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            });

            editor.trigger('contextmenu', { e: event, view: editor.view }); 
            break;    
        default: break;
        }
    });
}