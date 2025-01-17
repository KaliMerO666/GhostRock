import Form from '../../../../admin-x-ds/global/form/Form';
import React, {useContext, useState} from 'react';
import Select from '../../../../admin-x-ds/global/form/Select';
import TextField from '../../../../admin-x-ds/global/form/TextField';
import Toggle from '../../../../admin-x-ds/global/form/Toggle';
import {Setting, SettingValue} from '../../../../types/api';
import {getSettingValues} from '../../../../utils/helpers';

import ImageUpload from '../../../../admin-x-ds/global/form/ImageUpload';
import clsx from 'clsx';
import {ReactComponent as PortalIcon1} from '../../../../assets/icons/portal-icon-1.svg';
import {ReactComponent as PortalIcon2} from '../../../../assets/icons/portal-icon-2.svg';
import {ReactComponent as PortalIcon3} from '../../../../assets/icons/portal-icon-3.svg';
import {ReactComponent as PortalIcon4} from '../../../../assets/icons/portal-icon-4.svg';
import {ReactComponent as PortalIcon5} from '../../../../assets/icons/portal-icon-5.svg';
import {ServicesContext} from '../../../providers/ServiceProvider';

const defaultButtonIcons = [
    {
        Component: PortalIcon1,
        value: 'icon-1'
    },
    {
        Component: PortalIcon2,
        value: 'icon-2'
    },
    {
        Component: PortalIcon3,
        value: 'icon-3'
    },
    {
        Component: PortalIcon4,
        value: 'icon-4'
    },
    {
        Component: PortalIcon5,
        value: 'icon-5'
    }
];

const LookAndFeel: React.FC<{
    localSettings: Setting[]
    updateSetting: (key: string, setting: SettingValue) => void
}> = ({localSettings, updateSetting}) => {
    const {fileService} = useContext(ServicesContext);

    const [portalButton, portalButtonStyle, portalButtonIcon, portalButtonSignupText] = getSettingValues(localSettings, ['portal_button', 'portal_button_style', 'portal_button_icon', 'portal_button_signup_text']);

    const currentIcon = portalButtonIcon as string || defaultButtonIcons[0].value;
    const isDefaultIcon = defaultButtonIcons.map(({value}) => value).includes(currentIcon);

    const [uploadedIcon, setUploadedIcon] = useState(isDefaultIcon ? undefined : currentIcon);

    const handleImageUpload = async (file: File) => {
        const imageUrl = await fileService!.uploadImage(file);
        updateSetting('portal_button_icon', imageUrl);
        setUploadedIcon(imageUrl);
    };

    const handleImageDelete = () => {
        updateSetting('portal_button_icon', null);
        setUploadedIcon(undefined);
    };

    return <Form marginTop>
        <Toggle
            checked={Boolean(portalButton)}
            label='Show portal button'
            labelStyle='heading'
            onChange={e => updateSetting('portal_button', e.target.checked)}
        />
        <Select
            options={[
                {value: 'icon-and-text', label: 'Icon and text'},
                {value: 'icon-only', label: 'Icon only'},
                {value: 'text-only', label: 'Text only'}
            ]}
            selectedOption={portalButtonStyle as string}
            title='Portal button style'
            onSelect={option => updateSetting('portal_button_style', option)}
        />
        {portalButtonStyle?.toString()?.includes('icon') &&
            <div className='flex gap-2 border border-green p-4'>
                {defaultButtonIcons.map(icon => (
                    <button className={clsx('border p-4', currentIcon === icon.value ? 'border-green' : 'border-transparent')} type="button" onClick={() => updateSetting('portal_button_icon', icon.value)}>
                        <icon.Component className="h-6 w-6 text-green" />
                    </button>
                ))}
                <div className={clsx('w-10 border', currentIcon === uploadedIcon ? 'border-green' : 'border-transparent')}>
                    <ImageUpload
                        id='test'
                        imageClassName='cursor-pointer'
                        imageURL={uploadedIcon}
                        onDelete={handleImageDelete}
                        onImageClick={() => uploadedIcon && updateSetting('portal_button_icon', uploadedIcon)}
                        onUpload={handleImageUpload}
                    />
                </div>
            </div>
        }
        {portalButtonStyle?.toString()?.includes('text') &&
            <TextField
                title='Signup button text'
                value={portalButtonSignupText as string}
                onChange={e => updateSetting('portal_button_signup_text', e.target.value)}
            />
        }
    </Form>;
};

export default LookAndFeel;
