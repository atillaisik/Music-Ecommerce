import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Profile, ProfileUpdate } from '../types/profile';
import { toast } from 'sonner';
import { mapSupabaseError } from './apiErrors';

const ALLOWED_PROFILE_FIELDS: readonly (keyof ProfileUpdate)[] = [
  'full_name',
  'avatar_url',
  'phone',
  'address',
];

const sanitizeProfileUpdate = (input: ProfileUpdate): ProfileUpdate => {
  const cleaned: ProfileUpdate = {};
  for (const key of ALLOWED_PROFILE_FIELDS) {
    if (key in input && input[key] !== undefined) {
      cleaned[key] = input[key];
    }
  }
  return cleaned;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw mapSupabaseError(error);
      return data as Profile;
    }
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const cleaned = sanitizeProfileUpdate(updates);
      if (Object.keys(cleaned).length === 0) {
        throw new Error('No allowed fields to update.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ ...cleaned, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw mapSupabaseError(error);
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error?.message ?? 'unknown error'}`);
    }
  });
};
