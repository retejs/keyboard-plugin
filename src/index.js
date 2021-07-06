function install(editor) {
    editor.view.container.focus();
    editor.on('keydown', e => {

        switch (e.key) {
        case 'Delete': // Delete a node
            editor.selected.each(n => editor.removeNode(n));
            break;
        case ' ': // Spawn a context menu at the mouse position, but make sure it's inside the editor
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

export default {
    install
}
