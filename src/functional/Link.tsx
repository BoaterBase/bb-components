import { h, ComponentInterface } from '@stencil/core';

export const Link = ({ href, history = undefined, direction = 'forward', ...props }: ComponentInterface & { href: string, direction?: string, history?: any }, children: any) => {
    return <a
        onClick={history && history[direction] && ((ev) => { ev.preventDefault(); history[direction](href) })}
        href={history && history.link && history.link(href) || href} {...props}>{children}</a>;
}